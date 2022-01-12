import * as tf from '@tensorflow/tfjs';
import React, { useEffect, useRef } from 'react';
import { ObjectDetectionUIProps } from '../types';
import { CLASSES } from './labels';

export const AILabObjectDetectionUI = ({
  detectionResults,
  height,
  modelConfig: modelConfig,
  onDrawComplete,
  width,
}: ObjectDetectionUIProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function drawDetections() {
    const { detections, maxIndices, scores, boxes } = detectionResults;

    // TODO: This canvas is getting redrawn every time.  That's why it's erasing old detections.
    // This should be optimized so that the same canvas is preserved and the canvas is cleared in code, rather than reloads
    // Prep Canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    canvas!.width = width;
    canvas!.height = height;
    ctx!.font = '16px sans-serif';
    ctx!.textBaseline = 'top';

    // Drawing starts
    let start = performance.now();

    for (const detection of detections) {
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
      onDrawComplete?.(performance.now() - start);
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      drawDetections();
    });
  }, [detectionResults, height, modelConfig, width]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
    />
  );
};
