import * as tf from '@tensorflow/tfjs';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// Load models to feed into all components
// @ts-ignore
export const loaders = [
  async () => ({
    SSDModel: await tf.loadGraphModel(
      'https://storage.googleapis.com/tfhub-tfjs-modules/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1/model.json'
    ),
    ClassificationModel: await tf.loadLayersModel(
      'https://d1zv2aa70wpiur.cloudfront.net/tfjs_quant_nsfw_mobilenet/model.json'
    ),
  }),
];
