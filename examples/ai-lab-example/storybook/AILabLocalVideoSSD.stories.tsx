import React from 'react';
import {
  AILabLocalVideo,
  AILabObjectDetectionUI,
  SimpleObjectDetectionUI,
} from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { CLASSES } from './labels';

export default {
  title: 'Example/AILabVideo/AILabLocalVideo/SSD Model',
  component: AILabLocalVideo,
  argTypes: {
    objectDetectionUI: {
      options: ['ai-lab', 'simple'],
      control: { type: 'select' },
    },
    videoSource: {
      type: 'text',
      defaultValue:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
    maxResults: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
    },
    iouThreshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
    labels: {
      control: {
        type: 'text',
        defaultValue: CLASSES.join(', '),
        description: 'Comma separated classification labels',
      },
    },
    displaySize: {
      options: ['content', 'max'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof AILabLocalVideo>;

////////////////////////////////////////////////////////////////
//                  Local Video Defaults
////////////////////////////////////////////////////////////////

const localVideoStory: ComponentStory<typeof AILabLocalVideo> = (
  args,
  { loaded }
) => {
  //@ts-ignore
  const theVideo = args.videoSource;
  return (
    <AILabLocalVideo
      //@ts-ignore
      ObjectDetectionUI={args.objectDectionUI}
      //@ts-ignore
      onInference={action('onInference', args.onInference)}
      //@ts-ignore
      perfCallback={action('perfCallback', args.perfCallback)}
      model={loaded.SSDModel}
      modelConfig={{
        modelType: 'ssd',
      }}
      style={{ height: '100%' }}
      src={theVideo}
      visual={args.visual}
    />
  );
};

export const withALocalVideoDefaluts = localVideoStory.bind({});
withALocalVideoDefaluts.args = {
  //@ts-ignore
  videoSource:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  objectDetectionUI: 'ai-lab',
  visual: true,
};
withALocalVideoDefaluts.parameters = {
  controls: { include: ['videoSource'] },
};

////////////////////////////////////////////////////////////////
//                  Local Video with Params
////////////////////////////////////////////////////////////////
const localVideoParamsStory: ComponentStory<typeof AILabLocalVideo> = (
  args,
  { loaded }
) => {
  //@ts-ignore
  const theVideo = args.videoSource;
  return (
    <AILabLocalVideo
      perf={args.perf}
      model={loaded.SSDModel}
      ObjectDetectionUI={
        //@ts-ignore
        args.objectDetectionUI === 'simple'
          ? SimpleObjectDetectionUI
          : AILabObjectDetectionUI
      }
      //@ts-ignore
      onInference={action('onInference', args.onInference)}
      //@ts-ignore
      perfCallback={action('perfCallback', args.perfCallback)}
      style={{ height: '100%' }}
      src={theVideo}
      modelConfig={{
        modelType: 'ssd',
        //@ts-ignore
        threshold: args.threshold,
        //@ts-ignore
        nmsActive: args.nmsActive,
        //@ts-ignore
        maxResults: args.maxResults,
        //@ts-ignore
        labels: args.labels.split(/,\s*/),
      }}
      visual={args.visual}
      displaySize={args.displaySize}
    />
  );
};

export const withLocalVideoAndCustomizedSettings = localVideoParamsStory.bind(
  {}
);
withLocalVideoAndCustomizedSettings.args = {
  //@ts-ignore
  iouThreshold: 0.5,
  labels: CLASSES.join(', '),
  maxResults: 20,
  nmsActive: true,
  objectDetectionUI: 'ai-lab',
  perf: true,
  threshold: 0.4,
  visual: true,
  videoSource:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  displaySize: 'content',
};

withLocalVideoAndCustomizedSettings.parameters = {
  controls: {
    include: [
      'iouThreshold',
      'labels',
      'maxResults',
      'nmsActive',
      'objectDetectionUI',
      'perf',
      'threshold',
      'visual',
      'videoSource',
      'displaySize',
    ],
  },
};
