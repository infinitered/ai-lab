import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Performance, PerformanceInfo, perfInfo } from '../../performance';
import { ImageProps, ModelConfig, Results } from '../../types';
import { AILabObjectDetectionUI } from '../AILabObjectDetectionUI';
import {
  getInferenceData,
  getModelDetections,
  predictClassification,
  predictSSD,
} from '../../lib/helpers';

const defaultModelConfig: ModelConfig = {
  modelType: 'ssd',
  threshold: 0.4,
  maxResults: 20,
  iouThreshold: 0.5,
  nmsActive: true,
  topK: 5,
};

export const AILabImage = ({
  model,
  modelConfig,
  ObjectDetectionUI = AILabObjectDetectionUI,
  onInference,
  perf,
  perfCallback,
  src,
  size = 224,
  visual,
  filter,
  displaySize,
  style,
}: ImageProps) => {
  const [isTFReady, setIsTFReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [drawingTime, setDrawingTime] = useState(0);
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const [detectionResults, setDetectionResults] = useState<any>({});
  const [results, setResults] = useState<Results>();

  const tensorFlowIt = async (model: tf.GraphModel | tf.LayersModel) => {
    const image = imgRef.current;
    const tensor = tf.browser.fromPixels(image!);

    let res;
    if (modelConfig?.modelType === 'ssd') {
      if (results)
        tf.dispose([
          //@ts-ignore
          results[0],
          //@ts-ignore
          results[1],
        ]);

      res = await predictSSD(tensor, model);
    } else if (modelConfig?.modelType === 'pose') {
      // @ts-ignore
      res = await model.estimatePoses(tensor, {
        maxPoses: 1,
        flipHorizontal: false,
      });
    } else {
      if (results) tf.dispose(results);
      res = await predictClassification(tensor, model, size);
    }
    setResults(res);

    tf.dispose(tensor);
  };

  useEffect(() => {
    tf.ready().then(() => {
      setIsTFReady(true);
    });
  }, []);

  useEffect(() => {
    const setupTFJS = async () => {
      if (perf === 'detailed' || perfCallback) {
        const perfMetrics = await perfInfo(async () => {
          await tensorFlowIt(model);
        });
        if (perf === 'detailed') {
          //@ts-ignore
          setPerfProps(perfMetrics);
        }
        if (perfCallback) {
          //@ts-ignore
          perfCallback(perfMetrics);
        }
      } else {
        await tensorFlowIt(model);
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

  useEffect(() => {
    (async function () {
      if (results) {
        const detections = await getModelDetections(results, modelConfig, {
          filter,
        });
        const inferences = await getInferenceData(detections, modelConfig);
        setDetectionResults(detections);
        onInference?.(inferences);
      }
    })();
  }, [modelConfig, results]);

  return (
    <div style={style}>
      <div style={{ position: 'relative' }}>
        {perf && perf !== 'none' && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <Performance {...perfProps} drawingTime={drawingTime} perf={perf} />
          </div>
        )}
        <img
          ref={imgRef}
          src={src}
          height={displaySize === 'max' ? '100%' : undefined}
          width={displaySize === 'max' ? '100%' : undefined}
        />
        {visual && (
          <ObjectDetectionUI
            detectionResults={detectionResults}
            height={imgRef.current?.offsetHeight ?? 0}
            modelConfig={{ ...defaultModelConfig, ...modelConfig }}
            onDrawComplete={(durationMs) => {
              if (perf !== 'none' && !drawingTime) {
                setDrawingTime(durationMs);
              }
            }}
            width={imgRef.current?.offsetWidth ?? 0}
          />
        )}
      </div>
    </div>
  );
};
