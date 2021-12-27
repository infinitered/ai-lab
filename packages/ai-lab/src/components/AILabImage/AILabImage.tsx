import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { CLASSES } from '../labels';
import {
  Performance,
  PerformanceInfo,
  perfInfo,
  PerformanceProps,
} from '../../performance';

export interface ImageLabProps {
  model: tf.GraphModel;
  modelInfo?: {
    modelType: 'classification' | 'ssd',
    threshold?: number,
    maxBoxes?: number,
    iouThreshold?: number,
    nmsActive?: Boolean
  };
}

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & PerformanceProps & ImageLabProps

const defaultModelConfig = {
  modelType: 'ssd',
  threshold: 0.4,
  maxBoxes: 20,
  iouThreshold: 0.5,
  nmsActive: true
}

export const AILabImage = ({
  model,
  perf,
  perfCallback,
  modelInfo,
  src,
  ...props
}: ImageProps) => {
  const [isTFReady, setIsTFReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingTime, setDrawingTime] = useState(0);
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const [detectionResults, setDetectionResults] = useState({})

  async function drawDetections() {
    if (!isTFReady) return
    //@ts-ignore
    const {prominentDetection, justBoxes, justValues} = detectionResults

    // Merge defaults & props
    //@ts-ignore
    const {threshold, maxBoxes, iouThreshold, nmsActive} = {...defaultModelConfig, ...modelInfo};

    // Move results back to JavaScript in parallel
    const [maxIndices, scores, boxes] = await Promise.all([
      prominentDetection.indices.data(),
      justValues.array(),
      justBoxes.array(),
    ]);

    // https://arxiv.org/pdf/1704.04503.pdf, use Async to keep visuals
    const nmsDetections = await tf.image.nonMaxSuppressionWithScoreAsync(
      justBoxes,
      justValues,
      maxBoxes,
      iouThreshold,
      threshold,
      nmsActive ? 1 : 0 // 0 is normal NMS, 1 is Soft-NMS for overlapping support
    );

    const chosen = await nmsDetections.selectedIndices.data();

    const image = imgRef.current;
    const { height, width } = image!;

    // TODO: This canvas is getting redrawn every time.  That's why it's erasing old detections.
    // This should be optimized so that the same canvas is preserved and the canvas is cleared in code, rather than reloads
    // Prep Canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    canvas!.width = width;
    canvas!.height = height;
    ctx!.font = '16px sans-serif';
    ctx!.textBaseline = 'top';

    tf.dispose([
      nmsDetections.selectedIndices,
      nmsDetections.selectedScores,
    ]);

    //Drawing starts
    let start = performance.now();

    for (const detection of chosen as any) {
      ctx!.strokeStyle = '#0F0';
      ctx!.lineWidth = 4;
      ctx!.globalCompositeOperation = 'destination-over';
      const detectedIndex = maxIndices[detection];
      const detectedClass = CLASSES[detectedIndex];
      const detectedScore = scores[detection];
      const dBox = boxes[detection];

      // No negative values for start positions
      const startY = dBox[0] > 0 ? dBox[0] * height : 0;
      const startX = dBox[1] > 0 ? dBox[1] * width : 0;
      const boxHeight = (dBox[2] - dBox[0]) * height;
      const boxWidth = (dBox[3] - dBox[1]) * width;
      ctx!.strokeRect(startX, startY, boxWidth, boxHeight);
      // Draw the label background.
      ctx!.globalCompositeOperation = 'source-over';
      ctx!.fillStyle = '#0B0';
      const textHeight = 16;
      const textPad = 4;
      const label = `${detectedClass} ${Math.round(detectedScore * 100)}%`;
      const textWidth = ctx!.measureText(label).width;
      ctx!.fillRect(startX, startY, textWidth + textPad, textHeight + textPad);
      // Draw the text last to ensure it's on top.
      ctx!.fillStyle = '#000000';
      ctx!.fillText(label, startX, startY);

      // Drawing ends
      setDrawingTime(performance.now() - start);
    }
  }

  const tensorFlowIt = async (model: tf.GraphModel) => {
    const image = imgRef.current;
    const tensor = tf.browser.fromPixels(image!);

    // SSD Mobilenet single batch
    const readyfied = tf.expandDims(tensor, 0);
    const results = await model.executeAsync(readyfied);

    // Get a clean tensor of top indices
    const prominentDetection = tf.topk((results as tf.Tensor<tf.Rank>[])[0]);
    const justBoxes = (results as tf.Tensor<tf.Rank>[])[1].squeeze<tf.Tensor<tf.Rank.R2>>();
    const justValues =
      prominentDetection.values.squeeze<tf.Tensor<tf.Rank.R1>>();

    // Store Box Detections
    setDetectionResults({prominentDetection, justBoxes, justValues})

    // Small Cleanup
    tf.dispose([
      //@ts-ignore
      results[0],
      //@ts-ignore
      results[1],
      tensor,
      readyfied,
    ]);
  };

  useEffect(() => {
    tf.ready().then(() => {
      setIsTFReady(true)
    });
  }, []);

  // @ts-ignore
  useEffect(drawDetections, [detectionResults, modelInfo?.modelType, modelInfo?.threshold, modelInfo?.maxBoxes, modelInfo?.iouThreshold, modelInfo?.nmsActive]);

  useEffect(() => {
    const setupTFJS = async () => {
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

    // Only go if everything is ready
    if (isTFReady) {
      const activeImage = imgRef.current;
      if (activeImage?.complete) {
        setupTFJS();
      } else {
        activeImage!.onload = setupTFJS;
      }
    }
  // This should listen for model changes, but that causes re-render issues
  }, [src, isTFReady]);

  return (
    <div style={{ position: 'relative' }}>
      <img ref={imgRef} src={src} {...props} />
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
