import React from 'react';
import { AILabVideo } from 'ai-lab';

export default {
  title: 'Example/AILabVideo',
  component: AILabVideo,
};

export const withAWebcam = () => (
  // add  `perf` to show performance metrics
  <AILabVideo />
);
