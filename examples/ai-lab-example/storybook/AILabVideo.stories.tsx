import React from 'react';
import { AILabWebCam, AILabLocalVideo } from 'ai-lab';
//@ts-ignore
import animals from './animals.mp4';

export default {
  title: 'Example/AILabVideo',
  component: [AILabWebCam, AILabLocalVideo],
};

export const withALocalVideo = () => <AILabLocalVideo perf src={animals} />;
export const withAWebcam = () => (
  // add  `perf` to show performance metrics
  <AILabWebCam perf />
);
