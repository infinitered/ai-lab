import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { CLASSES } from '../labels';
import {
  Performance,
  PerformanceInfo,
  perfInfo,
  PerformanceProps,
} from '../../performance';

export interface ImageProps
  extends React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    PerformanceProps {}

export const AILabImage = ({
  perf,
  perfCallback,
  src,
  ...props
}: ImageProps) => {
  const [isTFReady, setIsTFReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingTime, setDrawingTime] = useState(0);
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();

  const modelPath =
    'https://storage.googleapis.com/tfhub-tfjs-modules/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1/model.json';

  const tensorFlowIt = async (model: tf.GraphModel) => {
    const image = imgRef.current;
    const { height, width } = image;
    const tensor = tf.browser.fromPixels(image);

    // SSD Mobilenet single batch
    const readyfied = tf.expandDims(tensor, 0);
    const results = await model.executeAsync(readyfied);

    // Prep Canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.font = '16px sans-serif';
    ctx.textBaseline = 'top';

    // Get a clean tensor of top indices
    const detectionThreshold = 0.4;
    const iouThreshold = 0.4;
    const maxBoxes = 20;
    const prominentDetection = tf.topk(results[0]);
    const justBoxes = results[1].squeeze<tf.Tensor<tf.Rank.R2>>();
    const justValues =
      prominentDetection.values.squeeze<tf.Tensor<tf.Rank.R1>>();

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
    //   results[0],
    //   results[1],
    //   model,
    //   nmsDetections.selectedIndices,
    //   nmsDetections.selectedScores,
    //   prominentDetection.indices,
    //   prominentDetection.values,
    //   tensor,
    //   readyfied,
    //   justBoxes,
    //   justValues,
    // ]);

    //Drawing starts
    let start = performance.now();

    for (const detection of chosen) {
      ctx.strokeStyle = '#0F0';
      ctx.lineWidth = 4;
      ctx.globalCompositeOperation = 'destination-over';
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
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#0B0';
      const textHeight = 16;
      const textPad = 4;
      const label = `${detectedClass} ${Math.round(detectedScore * 100)}%`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(startX, startY, textWidth + textPad, textHeight + textPad);
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = '#000000';
      ctx.fillText(label, startX, startY);

      // Drawing ends
      setDrawingTime(performance.now() - start);
    }
  };

  useEffect(() => {
    tf.ready().then(() => setIsTFReady(true));
  }, []);

  useEffect(() => {
    const setupTFJS = async () => {
      const model = await tf.loadGraphModel(modelPath);
      if (perf || perfCallback) {
        const perfMetrics = await perfInfo(async () => {
          await tensorFlowIt(model);
        });
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
    <div style={{ position: 'relative' }}>
      <img ref={imgRef} src={src} alt="image" {...props} />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
      />
      {perf && perfProps && !!drawingTime && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <Performance {...perfProps} drawingTime={drawingTime} />
        </div>
      )}
    </div>
  );
};
