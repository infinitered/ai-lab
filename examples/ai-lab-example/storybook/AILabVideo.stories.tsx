import React from 'react';
import { AILabWebCam, AILabLocalVideo } from 'ai-lab';
//@ts-ignore
import holiday from './holiday.mp4';

export default {
  title: 'Example/AILabVideo',
  component: [AILabWebCam, AILabLocalVideo],
};

export const withALocalVideo = () => <AILabLocalVideo perf src={holiday} />;
export const withAWebcam = () => (
  // add  `perf` to show performance metrics
  <AILabWebCam perf />
);
