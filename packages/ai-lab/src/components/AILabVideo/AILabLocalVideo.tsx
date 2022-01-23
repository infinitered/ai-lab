import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Performance, perfInfo, PerformanceInfo } from '../../performance';
import { VideoProps, ModelConfig, Results } from '../../types';
import {
  getInferenceData,
  getModelDetections,
  predictClassification,
  predictSSD,
} from '../../lib/helpers';
import { AILabObjectDetectionUI } from '..';

const defaultModelConfig: ModelConfig = {
  modelType: 'ssd',
  threshold: 0.4,
  maxResults: 20,
  iouThreshold: 0.5,
  nmsActive: true,
  topK: 5,
};

let activeInfer = false;

export const AILabLocalVideo = ({
  model,
  modelConfig,
  ObjectDetectionUI = AILabObjectDetectionUI,
  onInference,
  perf,
  perfCallback,
  size = 224,
  src,
  visual,
}: VideoProps) => {
  const [isTFReady, setIsTFReady] = useState(false);
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const [drawingTime, setDrawingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detectionResults, setDetectionResults] = useState<any>({});
  const [results, setResults] = useState<Results>();
  const fpsInfo = useRef({
    lastTensor: -1,
    fps: 0,
    calculateFps: () => Math.round(fpsInfo.current.fps * 100) / 100,
  });

  const maxWidth = window.innerWidth - 18; // subtract scrollbar
  const maxHeight = window.innerHeight;

  async function tensorFlowIt(model: tf.GraphModel | tf.LayersModel) {
    // fix scan ahead processing issue
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
    if (!videoRef.current || activeInfer || videoRef.current.readyState < 2) {
      requestAnimationFrame(() => tensorFlowIt(model));
      return;
    }

    activeInfer = true;
    const tensor = tf.browser.fromPixels(videoRef.current);

    if (modelConfig?.modelType === 'ssd') {
      if (results)
        tf.dispose([
          //@ts-ignore
          results[0],
          //@ts-ignore
          results[1],
        ]);

      const res = await predictSSD(tensor, model);
      setResults(res);
    } else {
      if (results) tf.dispose(results);
      const res = await predictClassification(tensor, model, size);
      setResults(res);
    }

    activeInfer = false;
  }

  useEffect(() => {
    tf.ready().then(() => {
      setIsTFReady(true);
    });
  }, []);

  function handleFpsCount() {
    if (fpsInfo.current.lastTensor !== -1) {
      const timeSinceLastTensor =
        performance.now() - fpsInfo.current.lastTensor;
      fpsInfo.current.fps = 1000 / timeSinceLastTensor;
    }

    fpsInfo.current.lastTensor = performance.now();
  }

  async function runInference() {
    if (activeInfer) return;

    console.log('calling runInference');
    if (perf || perfCallback) {
      handleFpsCount();

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
      await tensorFlowIt(model);
    }

    // Loop unless paused
    if (videoRef.current!.paused === false) {
      requestAnimationFrame(runInference);
    }
  }

  function startInference() {
    if (!isTFReady) return;
    runInference();
  }

  function stopTFJS() {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setPerfProps(undefined);
  }

  function pauseFpsCalc() {
    fpsInfo.current.lastTensor = -1;
  }

  useEffect(() => {
    (async function () {
      if (results) {
        const detections = await getModelDetections(results, modelConfig);
        const inferences = await getInferenceData(detections, modelConfig);
        setDetectionResults(detections);
        onInference?.(inferences);
      }
    })();
  }, [modelConfig, results]);

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {perf && perfProps && !!drawingTime && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <Performance
              {...perfProps}
              drawingTime={drawingTime}
              fps={fpsInfo.current.calculateFps()}
            />
          </div>
        )}
        {visual && (
          <ObjectDetectionUI
            detectionResults={detectionResults}
            height={videoRef.current?.height ?? 0}
            modelConfig={{ ...defaultModelConfig, ...modelConfig }}
            onDrawComplete={(durationMs) => {
              if (!drawingTime) {
                setDrawingTime(durationMs);
              }
            }}
            width={videoRef.current?.width ?? 0}
          />
        )}
        <video
          crossOrigin="anonymous"
          id="video"
          src={src}
          ref={videoRef}
          width={maxWidth}
          height={maxHeight}
          controls
          onEnded={stopTFJS}
          onPause={pauseFpsCalc}
          onPlay={startInference}
          muted
        />
      </div>
    </div>
  );
};
