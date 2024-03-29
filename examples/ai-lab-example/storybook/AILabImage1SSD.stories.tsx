import React from 'react';
import {
  AILabImage,
  AILabObjectDetectionUI,
  SimpleObjectDetectionUI,
} from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { CLASSES } from './labels';

const filterGroups = {
  people: [0],
  vehicles: [1, 2, 3, 4, 5, 6, 7, 8],
  seats: [61, 62, 14],
};

export default {
  title: 'Examples/AILabImage/SSD Model',
  component: AILabImage,
  argTypes: {
    objectDetectionUI: {
      options: ['ai-lab', 'simple'],
      control: { type: 'select' },
    },
    imageSource: {
      options: ['dinner', 'cat', 'beach'],
      control: { type: 'select' },
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
    filter: {
      options: ['all', 'people', 'vehicles', 'seats'],
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
  // @ts-ignore
  const theImage = gimmeImage(args.imageSource);
  return (
    <AILabImage
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
      src={theImage}
      style={{ height: '100%' }}
      visual={args.visual}
    />
  );
};

export const withAnImageDefaults = imageStory.bind({});
// @ts-ignore
withAnImageDefaults.args = {
  //@ts-ignore
  imageSource: 'cat',
  objectDetectionUI: 'ai-lab',
  visual: true,
};
withAnImageDefaults.parameters = {
  controls: {
    include: ['imageSource'],
  },
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
      model={loaded.SSDModel}
      perf={args.perf}
      src={theImage}
      style={{ height: '100%' }}
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
      //@ts-ignore
      filter={filterGroups[args.filter]}
      displaySize={args.displaySize}
    />
  );
};
export const withImageAndCustomizedSettings = imageParamsStory.bind({});
withImageAndCustomizedSettings.args = {
  //@ts-ignore
  imageSource: 'dinner',
  iouThreshold: 0.5,
  labels: CLASSES.join(', '),
  maxResults: 20,
  nmsActive: true,
  objectDetectionUI: 'ai-lab',
  perf: 'simple',
  threshold: 0.4,
  visual: true,
  displaySize: 'content',
  //@ts-ignore
  filter: 'all',
};

withImageAndCustomizedSettings.parameters = {
  controls: {
    include: [
      'imageSource',
      'iouThreshold',
      'labels',
      'maxResults',
      'nmsActive',
      'objectDetectionUI',
      'perf',
      'threshold',
      'visual',
      'displaySize',
      'filter',
    ],
  },
};
