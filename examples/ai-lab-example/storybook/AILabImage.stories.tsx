import React from 'react';
import { AILabImage } from 'ai-lab';

export default {
  title: 'Example/AILabImage',
  component: AILabImage,
};

export const withAnImage = () => (
  // add  `perf` to show performance metrics
  <AILabImage perf src={require('./dinner.jpg')} />
);
