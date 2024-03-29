import * as tf from '@tensorflow/tfjs';
import { Detections } from '..';
import { ModelConfig, Results } from '../types';

const defaultModelConfig: ModelConfig = {
  modelType: 'ssd',
  threshold: 0.4,
  maxResults: 20,
  iouThreshold: 0.5,
  nmsActive: true,
  topK: 5,
};

export async function ssdModelDetection(results: Results, config: ModelConfig) {
  // Get a clean tensor of top indices
  const prominentDetection = tf.topk((results as tf.Tensor<tf.Rank>[])[0]);

  // @ts-ignore
  const justBoxes = (results as tf.Tensor<tf.Rank>[])[1].squeeze<
    tf.Tensor<tf.Rank.R2>
  >();

  // @ts-ignore
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

  let detections = await nmsDetections.selectedIndices.array();

  tf.dispose([
    nmsDetections.selectedIndices,
    nmsDetections.selectedScores,
    prominentDetection.values,
    prominentDetection.indices,
    justValues,
    justBoxes,
  ]);

  // @ts-ignore
  if (config.filter) {
    // Filter results by filter classes
    // @ts-ignore
    detections = detections.flatMap((x) => {
      let xClass = maxIndices[x];

      // @ts-ignore
      if (config.filter.includes(xClass)) {
        return x;
      } else {
        return [];
      }
    });
  }

  return { detections, maxIndices, scores, boxes };
}

export async function classificationModelDetection(
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

  return finalResults;
}

export async function predictSSD(
  tensor: tf.Tensor3D,
  model: tf.GraphModel | tf.LayersModel
) {
  // SSD Mobilenet single batch
  const readyfied = tf.expandDims(tensor, 0);
  const res = await (model as tf.GraphModel).executeAsync(readyfied);

  // clean up
  tf.dispose(readyfied);
  return res;
}

export async function predictClassification(
  tensor: tf.Tensor3D,
  model: tf.GraphModel | tf.LayersModel,
  size: number
) {
  // @ts-ignore
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
  const results = model.predict(batched);

  return results;
}

export async function getModelDetections(
  results: Results,
  modelConfig: ModelConfig = defaultModelConfig,
  componentConfig: Object = {}
) {
  if (modelConfig?.modelType === 'ssd') {
    return await ssdModelDetection(results, {
      ...defaultModelConfig,
      ...componentConfig,
      ...modelConfig,
    });
  } else if (modelConfig?.modelType === 'pose') {
    //@ts-ignore
    return results[0];
  } else {
    return await classificationModelDetection(results, {
      ...defaultModelConfig,
      ...modelConfig,
    });
  }
}

export async function getInferenceData(
  results: number[] | Detections,
  modelConfig: ModelConfig = defaultModelConfig
) {
  const { labels } = modelConfig;

  if (modelConfig?.modelType === 'ssd') {
    //@ts-ignore
    const { detections, maxIndices, scores } = results;
    const ssdInferData = Array.from(detections).map((data, key) => ({
      class: key,
      classLabel: labels ? labels[maxIndices[data]] : `class ${key}`,
      score: scores[data],
    }));
    return ssdInferData;
  } else if (modelConfig?.modelType === 'pose') {
    return results;
  } else {
    //@ts-ignore
    const res = results.map((data, key) => ({
      class: key,
      classLabel: labels ? labels[key] : `class ${key}`,
      score: data,
    }));
    return res;
  }
}
