import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Performance, perfInfo, PerformanceInfo } from '../../performance';
import { CLASSES } from '../labels';
import { VideoProps } from './types';

export const AILabLocalVideo = ({ perf, perfCallback, src }: VideoProps) => {
  const [isTFReady, setIsTFReady] = useState(false);
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const [drawingTime, setDrawingTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [curModel, setCurModel] = useState<tf.GraphModel | null>(null);

  const modelPath =
    'https://storage.googleapis.com/tfhub-tfjs-modules/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1/model.json';
  const maxWidth = window.innerWidth - 18; // subtract scrollbar
  const maxHeight = window.innerHeight;

  function prepCanvas() {
    // Prep Canvas
    const ctx = canvasRef.current!.getContext('2d')!;
    canvasRef.current!.width = maxWidth;
    canvasRef.current!.height = maxHeight;
    ctx.font = '16px sans-serif';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = '#0F0';
    ctx.lineWidth = 4;
    ctx.globalCompositeOperation = 'destination-over';
    return ctx;
  }

  async function tensorFlowIt(model: tf.GraphModel | null) {
    if (!videoRef.current) return;
    const tensor = tf.browser.fromPixels(videoRef.current);
    const readyfied = tf.expandDims(tensor, 0);
    const results = await model!.executeAsync(readyfied);

    const ctx = prepCanvas();

    // Get a clean tensor of top indices
    const detectionThreshold = 0.4;
    const iouThreshold = 0.4;
    const maxBoxes = 20;
    // @ts-ignore
    const prominentDetection = tf.topk(results[0]);
    // @ts-ignore
    const justBoxes = results[1].squeeze<tf.Tensor<tf.Rank.R2>>();
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

    //Drawing starts
    let start = performance.now();

    for (const detection of chosen as any) {
      ctx.strokeStyle = '#0F0';
      ctx.lineWidth = 4;
      ctx.globalCompositeOperation = 'destination-over';
      const detectedIndex = maxIndices[detection];
      const detectedClass = CLASSES[detectedIndex];
      const detectedScore = scores[detection];
      const dBox = boxes[detection];

      // No negative values for start positions
      const startY = dBox[0] > 0 ? dBox[0] * maxHeight : 0;
      const startX = dBox[1] > 0 ? dBox[1] * maxWidth : 0;
      const boxHeight = (dBox[2] - dBox[0]) * maxHeight;
      const boxWidth = (dBox[3] - dBox[1]) * maxWidth;
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

    //Preventing memory leak when it's repainted over and over
    tf.dispose([
      // @ts-ignore
      results[0],
      // @ts-ignore
      results[1],
      // model,
      nmsDetections.selectedIndices,
      nmsDetections.selectedScores,
      prominentDetection.indices,
      prominentDetection.values,
      tensor,
      readyfied,
      justBoxes,
      justValues,
    ]);
  }

  useEffect(() => {
    tf.ready().then(() => {
      setIsTFReady(true);
      setupTFJS();
    });
  }, []);

  const setupTFJS = async () => {
    const model = await tf.loadGraphModel(modelPath);
    setCurModel(model);
  };

  async function runInference() {
    if (!isTFReady) return;
    if (perf || perfCallback) {
      const perfMetrics = await perfInfo(async () => {
        await tensorFlowIt(curModel);
      });

      if (perf) {
        setPerfProps(perfMetrics);
      } else if (perfCallback) {
        perfCallback(perfMetrics);
      }
    } else {
      await tensorFlowIt(curModel);
    }

    // Loop unless paused
    if (!videoRef.current!.paused) requestAnimationFrame(runInference);
  }

  function stopTFJS() {
    if (!videoRef.current) return;
    videoRef.current.pause();
    const ctx = prepCanvas();
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setPerfProps(undefined);
  }

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {perf && perfProps && !!drawingTime && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <Performance {...perfProps} drawingTime={drawingTime} />
          </div>
        )}

        <canvas
          id="canvas"
          ref={canvasRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        />
        <video
          crossOrigin="anonymous"
          id="video"
          src={src}
          ref={videoRef}
          width={maxWidth}
          height={maxHeight}
          controls
          onEnded={stopTFJS}
          onPlay={runInference}
        />
      </div>
    </div>
  );
};
