import React from 'react';
import { AILabWebCam, AILabLocalVideo } from 'ai-lab';
// //@ts-ignore
// import friends from './friends.mp4';

export default {
  title: 'Example/AILabVideo',
  component: [AILabWebCam, AILabLocalVideo],
};

const controlArgs = {
  perf: true,
};

const withALocalVideoStory = (args: { perf: any }) => (
  <AILabLocalVideo
    perf={args.perf}
    src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  />
);

export const withALocalVideo = withALocalVideoStory.bind({});
// @ts-ignore
withALocalVideo.args = controlArgs;

const withAWebcamStory = (args: { perf: any }) => (
  <AILabWebCam perf={args.perf} />
);
export const withAWebcam = withAWebcamStory.bind({});
// @ts-ignore
withAWebcam.args = controlArgs;
