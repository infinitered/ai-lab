import React, { useEffect, useRef, useState } from 'react';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { View, Image, ImageProps, LayoutRectangle } from 'react-native';
import Canvas from 'react-native-canvas';
import * as tf from '@tensorflow/tfjs';
import { CLASSES } from './labels';
import { Performance, PerformanceInfo, perfInfo } from '../../performance';

export interface AILabNativeImage extends ImageProps {
  perf?: boolean;
  perfCallback?: (perf: PerformanceInfo) => any;
}

export const AILabNativeImage = ({
  perf,
  perfCallback,
  source,
  ...props
}: AILabNativeImage) => {
  const [imgDimensions, setImgDimensions] = useState<LayoutRectangle>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const [isTFReady, setIsTFReady] = useState(false);
  const [drawingTime, setDrawingTime] = useState(0);
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const canvasRef = useRef<Canvas>(null);

  const modelPath =
    'https://storage.googleapis.com/tfhub-tfjs-modules/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1/model.json';

  const tensorFlowIt = async (model: tf.GraphModel) => {
    const imageURI = Image.resolveAssetSource(source).uri;
    const response = await fetch(imageURI, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer);
    const { height, width } = imgDimensions;
    const tensor = decodeJpeg(imageData)
      .resizeBilinear([height, width])
      .toInt();

    // SSD Mobilenet single batch
    const readyfied = tensor.expandDims();
    const results = await model.executeAsync(readyfied);
    const [detections, detectionAreas] = results as tf.Tensor<tf.Rank.R2>[];

    // Prep Canvas
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.font = '16px sans-serif';
    ctx.textBaseline = 'top';

    // Get a clean tensor of top indices
    const detectionThreshold = 0.2;
    const iouThreshold = 0.2;
    // set to 0.1 to bring only 1 unbrella with beach.jpeg file
    const maxBoxes = 20;
    const prominentDetection = tf.topk(detections);
    const justBoxes = detectionAreas.squeeze<tf.Tensor<tf.Rank.R2>>();
    const justValues = prominentDetection.values.squeeze<
      tf.Tensor<tf.Rank.R1>
    >();

    // Move results back to JavaScript in parallel
    const [maxIndices, scores, boxes] = await Promise.all([
      prominentDetection.indices.data(),
      justValues.array(),
      justBoxes.array(),
    ]);

    // https://arxiv.org/pdf/1704.04503.pdf, use Async to keep visuals
    const nmsDetections = await tf.image.nonMaxSuppressionWithScoreAsync(
      justBoxes, // [numBoxes, 4]
      justValues, // [numBoxes]
      maxBoxes,
      iouThreshold,
      detectionThreshold,
      1 // 0 is normal NMS, 1 is Soft-NMS for overlapping support
    );

    const chosen = await nmsDetections.selectedIndices.data();

    // Mega Clean
    tf.dispose([
      (results as tf.Tensor<tf.Rank>[])[0],
      (results  as tf.Tensor<tf.Rank>[])[1],
      model as any,
      nmsDetections.selectedIndices,
      nmsDetections.selectedScores,
      prominentDetection.indices,
      prominentDetection.values,
      tensor,
      readyfied,
      justBoxes,
      justValues,
    ]);

    // Drawing time measuring starts
    let start = performance.now();

    for (const detection of chosen as any) {
      ctx.strokeStyle = '#0F0';
      ctx.lineWidth = 4;
      ctx.globalCompositionOperation = 'destination-over';
      const detectedIndex = maxIndices[detection];
      const detectedClass = CLASSES[detectedIndex];
      const detectedScore = scores[detection];
      const dBox = boxes[detection];

      // No negative values for start positions
      const startY = dBox[0] > 0 ? dBox[0] * height : 0;
      const startX = dBox[1] > 0 ? dBox[1] * width : 0;
      const boxHeight = (dBox[2] - dBox[0]) * height;
      const boxWidth = (dBox[3] - dBox[1]) * width;
      ctx.strokeRect(startX, startY, boxWidth, boxHeight);

      // Draw the label background.
      ctx.globalCompositionOperation = 'source-over';
      const textHeight = 16;
      const textPad = 4;
      const label = `${detectedClass} ${Math.round(detectedScore * 100)}%`;
      const textWidth = (await ctx.measureText(label)).width;
      ctx.fillStyle = '#0B0';
      ctx.fillRect(startX, startY, textWidth + textPad, textHeight + textPad);
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000';
      ctx.fillText(label, startX, startY);
    }
    // Drawing time measuring ends
    setDrawingTime(performance.now() - start);
  };

  useEffect(() => {
    tf.ready().then(() => setIsTFReady(true));
  }, []);

  useEffect(() => {
    const setupTFJS = async () => {
      const model = await tf.loadGraphModel(modelPath);
      if (perf || perfCallback) {
        const perfMetrics = await perfInfo(
          async () => await tensorFlowIt(model)
        );
        if (perf) {
          setPerfProps(perfMetrics);
        }
        if (perfCallback) {
          perfCallback(perfMetrics);
        }
      } else {
        tensorFlowIt(model);
      }
    };
    if (isTFReady) {
      setupTFJS();
    }
  }, [isTFReady]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View>
        <Image
          onLayout={event => {
            setImgDimensions(event.nativeEvent.layout);
          }}
          source={source}
          style={{ height: 300, width: 400 }}
          {...props}
        />
        <Canvas
          ref={canvasRef}
          style={{
            borderColor: 'red',
            borderWidth: 2,
            position: 'absolute',
            width: imgDimensions.width,
            height: imgDimensions.height,
            top: imgDimensions.y,
            left: imgDimensions.x,
          }}
        />
      </View>
      <View>
        {perf && !!drawingTime && perfProps && (
          <Performance {...perfProps} drawingTime={drawingTime} />
        )}
      </View>
    </View>
  );
};
