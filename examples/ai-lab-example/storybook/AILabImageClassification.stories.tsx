import React from 'react';
import { AILabImage } from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

const CLASSES = ['Drawing', 'Hentai', 'Neutral', 'Porn', 'Sexy'];

export default {
  title: 'Example/AILabImage/Classification Model',
  component: AILabImage,
  argTypes: {
    imageSource: {
      options: ['dinner', 'cat', 'beach'],
      control: { type: 'select' },
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
    maxResults: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
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
} as ComponentMeta<typeof AILabImage>;

const gimmeImage = (src: string) => {
  switch (src) {
    case 'dinner':
      return require('./dinner.jpg');
    case 'cat':
      return require('./cat.jpeg');
    default:
      return require('./beach.jpeg');
  }
};

////////////////////////////////////////////////////////////////
//                  Image Defaults
////////////////////////////////////////////////////////////////

const imageStory: ComponentStory<typeof AILabImage> = (args, { loaded }) => {
  //@ts-ignore
  const theImage = gimmeImage(args.imageSource);
  return (
    <AILabImage
      //@ts-ignore
      onInference={action('onInference', args.onInference)}
      //@ts-ignore
      perfCallback={action('perfCallback', args.perfCallback)}
      model={loaded.ClassificationModel}
      modelConfig={{
        modelType: 'classification',
      }}
      src={theImage}
      style={{ height: '100%' }}
    />
  );
};

export const withAnImageDefaults = imageStory.bind({});
// @ts-ignore
withAnImageDefaults.args = {
  //@ts-ignore
  imageSource: 'cat',
};
withAnImageDefaults.parameters = {
  controls: { include: ['imageSource'] },
};

////////////////////////////////////////////////////////////////
//                  Image with Params
////////////////////////////////////////////////////////////////
const imageParamsStory: ComponentStory<typeof AILabImage> = (
  args,
  { loaded }
) => {
  //@ts-ignore
  const theImage = gimmeImage(args.imageSource);
  return (
    <AILabImage
      //@ts-ignore
      onInference={action('onInference', args.onInference)}
      //@ts-ignore
      perfCallback={action('perfCallback', args.perfCallback)}
      model={loaded.ClassificationModel}
      perf={args.perf}
      size={224}
      src={theImage}
      style={{ height: '100%' }}
      modelConfig={{
        modelType: 'classification',
        //@ts-ignore
        threshold: args.threshold,
        //@ts-ignore
        maxResults: args.maxResults,
        //@ts-ignore
        labels: args.labels.split(/,\s*/),
      }}
      displaySize={args.displaySize}
    />
  );
};
export const withImageAndCustomizedSettings = imageParamsStory.bind({});
withImageAndCustomizedSettings.args = {
  //@ts-ignore
  imageSource: 'dinner',
  maxResults: 5, //topk
  perf: "simple",
  threshold: 0.4,
  labels: CLASSES.join(', '),
  displaySize: 'content',
};

withImageAndCustomizedSettings.parameters = {
  controls: {
    include: [
      'imageSource',
      'maxResults',
      'perf',
      'threshold',
      'labels',
      'displaySize',
    ],
  },
};
