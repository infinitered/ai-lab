import React from 'react';
import { AILabWebCam } from 'ai-lab';

export default {
  title: 'Example/AILabVideo',
  component: AILabWebCam,
};

export const withAWebcam = () => (
  // add  `perf` to show performance metrics
  <AILabWebCam perf />
);
