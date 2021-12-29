import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Performance, PerformanceInfo, perfInfo } from '../../performance';
import { ImageProps, ModelInfo } from '../../types';
import { AILabObjectDetectionUI } from '../AILabObjectDetectionUI';

const defaultModelConfig: ModelInfo = {
  modelType: 'ssd',
  threshold: 0.4,
  maxBoxes: 20,
  iouThreshold: 0.5,
  nmsActive: true,
};

export const AILabImage = ({
  model,
  modelInfo,
  // ObjectDetectionUI = AILabObjectDetectionUI,
  perf,
  perfCallback,
  src,
  visual,
  ...props
}: ImageProps) => {
  const [isTFReady, setIsTFReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [drawingTime, setDrawingTime] = useState(0);
  const [perfProps, setPerfProps] = useState<PerformanceInfo>();
  const [detectionResults, setDetectionResults] = useState<any>({});

  const tensorFlowIt = async (model: tf.GraphModel) => {
    const image = imgRef.current;
    const tensor = tf.browser.fromPixels(image!);

    // SSD Mobilenet single batch
    const readyfied = tf.expandDims(tensor, 0);
    const results = await model.executeAsync(readyfied);

    // Get a clean tensor of top indices
    const prominentDetection = tf.topk((results as tf.Tensor<tf.Rank>[])[0]);
    const justBoxes = (results as tf.Tensor<tf.Rank>[])[1].squeeze<
      tf.Tensor<tf.Rank.R2>
    >();
    const justValues =
      prominentDetection.values.squeeze<tf.Tensor<tf.Rank.R1>>();

    // Store Box Detections
    setDetectionResults({ prominentDetection, justBoxes, justValues });

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
      setIsTFReady(true);
    });
  }, []);

  useEffect(() => {
    const setupTFJS = async () => {
      if (perf || perfCallback) {
        const perfMetrics = await perfInfo(async () => {
          await tensorFlowIt(model);
        });
        if (perf) {
          //@ts-ignore
          setPerfProps(perfMetrics);
        }
        if (perfCallback) {
          //@ts-ignore
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
      {visual && (
        <AILabObjectDetectionUI
          detectionResults={detectionResults}
          height={imgRef.current?.height ?? 0}
          modelInfo={{ ...defaultModelConfig, ...modelInfo }}
          onDrawComplete={(durationMs) => {
            if (!drawingTime) {
              console.log({ drawingTime });
              setDrawingTime(durationMs);
            }
          }}
          width={imgRef.current?.width ?? 0}
        />
      )}
      {perf && perfProps && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <Performance {...perfProps} drawingTime={drawingTime} />
        </div>
      )}
    </div>
  );
};
