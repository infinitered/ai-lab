import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Performance, PerformanceInfo, perfInfo } from '../../performance';
import { ImageProps, ModelInfo } from '../../types';
import { AILabObjectDetectionUI } from '../AILabObjectDetectionUI';
import { CLASSES } from '../labels';

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
  ObjectDetectionUI = AILabObjectDetectionUI,
  onInference,
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

  const tensorFlowIt = async (model: tf.GraphModel | tf.LayersModel) => {
    const image = imgRef.current;
    const tensor = tf.browser.fromPixels(image!);
    console.log(
      typeof model === typeof tf.LayersModel
        ? //@ts-ignore
          model.layers.map((l) => l.name)
        : null
    );

    // typeof model === typeof tf.LayersModel &&
    //   (model as tf.LayersModel).layers.find((l) => console.log(l.name));

    // SSD Mobilenet single batch
    const readyfied = tf.expandDims(tensor, 0);
    const results = model.predict(readyfied);
    model.hasOwnProperty('layers')
      ? model.predict(readyfied)
      : await (model as tf.GraphModel).executeAsync(readyfied);

    // Get a clean tensor of top indices
    const prominentDetection = tf.topk((results as tf.Tensor<tf.Rank>[])[0]);
    const justBoxes = (results as tf.Tensor<tf.Rank>[])[1].squeeze<
      tf.Tensor<tf.Rank.R2>
    >();
    const justValues =
      prominentDetection.values.squeeze<tf.Tensor<tf.Rank.R1>>();

    const { threshold, maxBoxes, iouThreshold, nmsActive } = {
      ...defaultModelConfig,
      ...modelInfo,
    };

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

    const detections = await nmsDetections.selectedIndices.data();

    tf.dispose([nmsDetections.selectedIndices, nmsDetections.selectedScores]);

    // Store Box Detections
    setDetectionResults({ detections, maxIndices, scores, boxes });

    //@ts-ignored
    onInference?.(
      Array.from(detections).map((d) => ({
        detectedClass: CLASSES[maxIndices[d]],
        detectedScore: scores[d],
      }))
    );

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
        <ObjectDetectionUI
          detectionResults={detectionResults}
          height={imgRef.current?.height ?? 0}
          modelInfo={{ ...defaultModelConfig, ...modelInfo }}
          onDrawComplete={(durationMs) => {
            if (!drawingTime) {
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
