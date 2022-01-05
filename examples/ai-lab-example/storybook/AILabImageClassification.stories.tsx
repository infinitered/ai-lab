import React from 'react';
import { AILabImage } from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

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
      control: { type: 'range', min: 0, max: 50, step: 1 },
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
      model={loaded.ClassificationModel}
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
      onInference={action('onInference', args.onInference)}
      perfCallback={action('perfCallback', args.perfCallback)}
      model={loaded.ClassificationModel}
      perf={args.perf}
      size={224}
      src={theImage}
      style={{ height: '100%' }}
      modelInfo={{
        modelType: 'classification',
        //@ts-ignore
        threshold: args.threshold,
        //@ts-ignore
        maxResults: args.maxResults,
      }}
    />
  );
};
export const withImageAndCustomizedSettings = imageParamsStory.bind({});
withImageAndCustomizedSettings.args = {
  //@ts-ignore
  imageSource: 'dinner',
  maxResults: 20,
  perf: true,
  threshold: 0.4,
};

withImageAndCustomizedSettings.parameters = {
  controls: {
    include: ['imageSource', 'maxResults', 'perf', 'threshold'],
  },
};