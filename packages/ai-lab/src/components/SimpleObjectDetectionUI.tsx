import * as tf from '@tensorflow/tfjs';
import React, { useEffect, useRef } from 'react';
import { ObjectDetectionUIProps } from '../types';

export const SimpleObjectDetectionUI = ({
  detectionResults,
  height,
  modelInfo,
  onDrawComplete,
  width,
}: ObjectDetectionUIProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function drawDetections() {
    const { prominentDetection, justBoxes, justValues } = detectionResults;
    const { threshold, maxBoxes, iouThreshold, nmsActive } = modelInfo;

    // Move results back to JavaScript in parallel
    const [, , boxes] = await Promise.all([
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

    // TODO: This canvas is getting redrawn every time.  That's why it's erasing old detections.
    // This should be optimized so that the same canvas is preserved and the canvas is cleared in code, rather than reloads
    // Prep Canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    canvas!.width = width;
    canvas!.height = height;
    ctx!.font = '16px sans-serif';
    ctx!.textBaseline = 'top';

    tf.dispose([nmsDetections.selectedIndices, nmsDetections.selectedScores]);

    // Drawing starts
    let start = performance.now();

    for (const detection of chosen as any) {
      ctx!.strokeStyle = '#F00';
      ctx!.lineWidth = 4;
      ctx!.globalCompositeOperation = 'destination-over';
      const dBox = boxes[detection];

      // No negative values for start positions
      const startY = dBox[0] > 0 ? dBox[0] * height : 0;
      const startX = dBox[1] > 0 ? dBox[1] * width : 0;
      const boxHeight = (dBox[2] - dBox[0]) * height;
      const boxWidth = (dBox[3] - dBox[1]) * width;
      ctx!.strokeRect(startX, startY, boxWidth, boxHeight);

      // Drawing ends
      onDrawComplete?.(performance.now() - start);
    }
  }

  useEffect(() => {
    tf.ready().then(drawDetections);
  }, [detectionResults, height, modelInfo, width]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
    />
  );
};
