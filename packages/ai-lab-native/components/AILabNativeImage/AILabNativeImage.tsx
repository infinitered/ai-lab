import React, { useEffect, useRef, useState } from 'react';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { View, Image, ImageProps, Text, LayoutRectangle } from 'react-native';
import Canvas from 'react-native-canvas';
import * as tf from '@tensorflow/tfjs';
import { CLASSES } from './labels';
import { Performance, PerformanceInfo, perfInfo } from '../Performance';

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

  const [isModelReady, setIsModelReady] = useState(false);
  const [isTensorFlowReady, setIsTensorFlowReady] = useState(false);
  const [model, setModel] = useState<tf.GraphModel>();
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const canvasRef = useRef<Canvas>(null);

  const modelPath =
    'https://storage.googleapis.com/tfhub-tfjs-modules/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1/model.json';

  useEffect(() => {
    async function loadModel(modelPath: string | tf.io.IOHandler) {
      try {
        const model = await tf.loadGraphModel(modelPath);
        setModel(model);
        setIsModelReady(true);
      } catch (err) {
        console.log('err', err);
      }
    }
    tf.ready().then(() => {
      loadModel(modelPath);
    });
  }, []);

  useEffect(() => {
    if (!isTensorFlowReady) {
      if (model && imgDimensions.width > 0) {
        async function tensorFlowIt() {
          const imageAssetPath = Image.resolveAssetSource(source);
          const response = await fetch(
            imageAssetPath.uri,
            {},
            { isBinary: true }
          );
          const imageDataArrayBuffer = await response.arrayBuffer();
          const imageData = new Uint8Array(imageDataArrayBuffer);
          const myTensor = decodeJpeg(imageData)
            .resizeBilinear([300, 400])
            .toInt();

          // SSD Mobilenet single batch
          const readyfied = tf.expandDims(myTensor, 0);
          const results = await model!.executeAsync(readyfied);
          // Prep Canvas
          const detection = canvasRef.current!;
          const ctx = detection.getContext('2d');
          const imgWidth = imgDimensions.width;
          const imgHeight = imgDimensions.height;
          detection.width = imgWidth;
          detection.height = imgHeight;
          ctx.font = '16px sans-serif';
          ctx.textBaseline = 'top';

          // Get a clean tensor of top indices
          const detectionThreshold = 0.2;
          const iouThreshold = 0.2;
          // set to 0.1 to bring only 1 unbrella with beach.jpeg file
          const maxBoxes = 20;
          // @ts-ignore
          const prominentDetection = tf.topk(results[0]);
          // @ts-ignore
          const justBoxes = results[1].squeeze();
          const justValues = prominentDetection.values.squeeze();

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
          // tf.dispose([
          //   // @ts-ignore
          //   results[0],
          //   // @ts-ignore
          //   results[1],
          //   model,
          //   nmsDetections.selectedIndices,
          //   nmsDetections.selectedScores,
          //   prominentDetection.indices,
          //   prominentDetection.values,
          //   myTensor,
          //   readyfied,
          //   justBoxes,
          //   justValues,
          // ]);

          chosen.forEach(async (detection: string | number) => {
            ctx.strokeStyle = '#0F0';
            ctx.lineWidth = 4;
            ctx.globalCompositionOperation = 'destination-over';
            const detectedIndex = maxIndices[detection];
            const detectedClass = CLASSES[detectedIndex];
            const detectedScore = scores[detection];
            const dBox = boxes[detection];

            // No negative values for start positions
            const startY = dBox[0] > 0 ? dBox[0] * imgHeight : 0;
            const startX = dBox[1] > 0 ? dBox[1] * imgWidth : 0;
            const height = (dBox[2] - dBox[0]) * imgHeight;
            const width = (dBox[3] - dBox[1]) * imgWidth;
            ctx.strokeRect(startX, startY, width, height);

            // Draw the label background.
            ctx.globalCompositionOperation = 'source-over';
            const textHeight = 16;
            const textPad = 4;
            const label = `${detectedClass} ${Math.round(
              detectedScore * 100
            )}%`;
            const textWidth = (await ctx.measureText(label)).width;
            ctx.fillStyle = '#0B0';
            ctx.fillRect(
              startX,
              startY,
              textWidth + textPad,
              textHeight + textPad
            );
            // Draw the text last to ensure it's on top.
            ctx.fillStyle = '#000000';
            ctx.fillText(label, startX, startY);
          });
        }
        setIsTensorFlowReady(true);

        (async () => {
          if (perf || perfCallback) {
            const perfMetrics = await perfInfo(tensorFlowIt);
            if (perf) {
              setPerfProps(perfMetrics);
            }
            if (perfCallback) {
              perfCallback(perfMetrics);
            }
          } else {
            tensorFlowIt();
          }
        })();
      }
    }
  }, [model, imgDimensions, isTensorFlowReady]);

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
        {/* The bounding box is still showing only half initially */}
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
      <View style={{ marginTop: 10 }}>
        {isModelReady && <Text>Model ready</Text>}
      </View>
      {isTensorFlowReady && perf && perfProps && <Performance {...perfProps} />}
    </View>
  );
};
