import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Performance, PerformanceInfo, perfInfo } from '../../performance';
import { ImageProps, ModelConfig, Results } from '../../types';
import { AILabObjectDetectionUI } from '../AILabObjectDetectionUI';
import { CLASSES } from '../labels';

const defaultModelConfig: ModelConfig = {
  modelType: 'ssd',
  threshold: 0.4,
  maxResults: 20,
  iouThreshold: 0.5,
  nmsActive: true,
  topK: 5,
};

async function ssdModelDetection(results: Results, config: ModelConfig) {
  // Get a clean tensor of top indices
  const prominentDetection = tf.topk((results as tf.Tensor<tf.Rank>[])[0]);

  const justBoxes = (results as tf.Tensor<tf.Rank>[])[1].squeeze<
    tf.Tensor<tf.Rank.R2>
  >();

  const justValues = prominentDetection.values.squeeze<tf.Tensor<tf.Rank.R1>>();

  const { threshold, maxResults = 20, iouThreshold, nmsActive } = config;

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
    maxResults, //maxBoxes
    iouThreshold,
    threshold,
    nmsActive ? 1 : 0 // 0 is normal NMS, 1 is Soft-NMS for overlapping support
  );

  const detections = await nmsDetections.selectedIndices.data();

  tf.dispose([nmsDetections.selectedIndices, nmsDetections.selectedScores]);

  return { detections, maxIndices, scores, boxes };
}

async function classificationModelDetection(
  results: Results,
  config: ModelConfig
) {
  const values = await (results as tf.Tensor2D).data();
  const valuesAndIndices = [];
  for (let i = 0; i < values.length; i++) {
    valuesAndIndices.push({ value: values[i], index: i });
  }

  valuesAndIndices.sort((a, b) => {
    return b.value - a.value;
  });

  const topkValues = new Float32Array(config.topK!);
  const topkIndices = new Int32Array(config.topK!);
  for (let i = 0; i < config.topK!; i++) {
    topkValues[i] = valuesAndIndices[i].value;
    topkIndices[i] = valuesAndIndices[i].index;
  }

  const { threshold, maxResults = config.topK! } = config;
  const topClassesAndProbs = [];
  for (let i = 0; i < maxResults; i++) {
    topClassesAndProbs.push(topkValues[i]);
  }

  const finalResults = topClassesAndProbs.filter(function (r) {
    return r > threshold!;
  });

  return { finalResults };
}

async function predictSSD(
  tensor: tf.Tensor3D,
  model: tf.GraphModel | tf.LayersModel
) {
  // SSD Mobilenet single batch

  const readyfied = tf.expandDims(tensor, 0);
  const res = await (model as tf.GraphModel).executeAsync(readyfied);

  return res;
}

async function predictClassification(
  tensor: tf.Tensor3D,
  model: tf.GraphModel | tf.LayersModel,
  size: number
) {
  const readyfied = tensor.toFloat().div(255);
  let resized = readyfied;
  if (tensor.shape[0] !== size || tensor.shape[1] !== size) {
    const alignCorners = true;
    resized = tf.image.resizeBilinear(
      readyfied as tf.Tensor3D,
      [size, size],
      alignCorners
    );
  }
  // Reshape to a single-element batch so we can pass it to predict.
  const batched = resized.reshape([1, size, size, 3]);
  const res = model.predict(batched);

  return res;
}

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
  ...props
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

    if (modelConfig?.modelType === 'ssd') {
      const res = await predictSSD(tensor, model);
      setResults(res);
    } else {
      const res = await predictClassification(tensor, model, size);
      setResults(res);
    }
  };

  async function getInferData(res: Results) {
    // Store Box Detections
    if (modelConfig?.modelType === 'ssd') {
      const { detections, maxIndices, scores, boxes } = await ssdModelDetection(
        res,
        {
          ...defaultModelConfig,
          ...modelConfig,
        }
      );
      setDetectionResults({ detections, maxIndices, scores, boxes });

      const ssdInferData = Array.from(detections).map((d) => ({
        detectedClass: CLASSES[maxIndices[d]],
        detectedScore: scores[d],
      }));

      onInference?.(ssdInferData);
    } else {
      const { finalResults } = await classificationModelDetection(res, {
        ...defaultModelConfig,
        ...modelConfig,
      });

      onInference?.(finalResults);
    }
  }

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
          console.log('called');
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
    if (results) {
      getInferData(results);
    }
  }, [modelConfig, results]);

  return (
    <div style={{ position: 'relative' }}>
      <img ref={imgRef} src={src} {...props} />
      {visual && (
        <ObjectDetectionUI
          detectionResults={detectionResults}
          height={imgRef.current?.height ?? 0}
          modelConfig={{ ...defaultModelConfig, ...modelConfig }}
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
