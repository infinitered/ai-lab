import React from 'react';
import { AILabWebCam, AILabLocalVideo } from 'ai-lab';
// //@ts-ignore
// import friends from './friends.mp4';

export default {
  title: 'Example/AILabVideo',
  component: [AILabWebCam, AILabLocalVideo],
};

export const withALocalVideo = () => (
  <AILabLocalVideo
    perf
    src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  />
);
export const withAWebcam = () => (
  // add  `perf` to show performance metrics
  <AILabWebCam perf />
);
