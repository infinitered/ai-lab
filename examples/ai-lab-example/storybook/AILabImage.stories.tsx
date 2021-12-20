import React from 'react';
import { AILabImage } from 'ai-lab';

export default {
  title: 'Example/AILabImage',
  component: AILabImage,
};

// @ts-ignore
const imageStory = args => {
  const theImage = require('./dinner.jpg');
  return (
    <AILabImage perf={args.perf} src={theImage} style={{ width: '100%' }} />
  );
};

export const withAnImage = imageStory.bind({});
// @ts-ignore
withAnImage.args = {
  perf: true,
  // restrain: false,
  // modelInfo: {
  //   model: 'this is the model',
  //   objectDetection: true,
  //   labels: ['dog', 'cat'],
  //   threshold: 0.4,
  //   max: 20,
  //   IOU: 0.5,
  // },
};
