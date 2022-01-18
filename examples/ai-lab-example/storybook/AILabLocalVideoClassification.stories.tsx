import React from 'react';
import { AILabLocalVideo } from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

const CLASSES = ['Drawing', 'Hentai', 'Neutral', 'Porn', 'Sexy'];

export default {
  title: 'Example/AILabVideo/AILabLocalVideo/Classification Model',
  component: AILabLocalVideo,
  argTypes: {
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
      model={loaded.ClassificationModel}
      style={{ height: '100%' }}
      src={theVideo}
    />
  );
};

export const withALocalVideoDefaluts = localVideoStory.bind({});
withALocalVideoDefaluts.args = {
  //@ts-ignore
  videoSource:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
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
      model={loaded.ClassificationModel}
      //@ts-ignore
      onInference={action('onInference', args.onInference)}
      //@ts-ignore
      perfCallback={action('perfCallback', args.perfCallback)}
      style={{ height: '100%' }}
      src={theVideo}
      modelConfig={{
        modelType: 'classification',
        //@ts-ignore
        threshold: args.threshold,
        //@ts-ignore
        maxResults: args.maxResults,
        //@ts-ignore
        labels: args.labels.split(/,\s*/),
      }}
    />
  );
};

export const withLocalVideoAndCustomizedSettings = localVideoParamsStory.bind(
  {}
);
withLocalVideoAndCustomizedSettings.args = {
  //@ts-ignore

  labels: CLASSES.join(', '),
  maxResults: 20,
  perf: true,
  threshold: 0.4,
  videoSource:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
};

withLocalVideoAndCustomizedSettings.parameters = {
  controls: {
    include: ['labels', 'maxResults', 'perf', 'threshold', 'videoSource'],
  },
};
