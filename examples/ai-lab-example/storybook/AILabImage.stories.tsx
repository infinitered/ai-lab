import React from 'react';
import {
  AILabImage,
  AILabObjectDetectionUI,
  SimpleObjectDetectionUI,
} from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Example/AILabImage/SSD Model',
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
    maxBoxes: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
    },
    iouThreshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
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
      model={loaded.SSDModel}
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
      ObjectDetectionUI={
        args.objectDetectionUI === 'simple'
          ? SimpleObjectDetectionUI
          : AILabObjectDetectionUI
      }
      onInference={action('onInference', args.onInference)}
      perfCallback={action('perfCallback', args.perfCallback)}
      model={loaded.SSDModel}
      perf={args.perf}
      src={theImage}
      style={{ height: '100%' }}
      modelInfo={{
        modelType: 'ssd',
        //@ts-ignore
        threshold: args.threshold,
        //@ts-ignore
        nmsActive: args.nmsActive,
        //@ts-ignore
        maxBoxes: args.maxBoxes,
      }}
      visual={args.visual}
    />
  );
};
export const withImageAndCustomizedSettings = imageParamsStory.bind({});
withImageAndCustomizedSettings.args = {
  //@ts-ignore
  imageSource: 'dinner',
  iouThreshold: 0.5,
  maxBoxes: 20,
  nmsActive: true,
  objectDetectionUI: 'ai-lab',
  perf: true,
  threshold: 0.4,
  visual: true,
};

withImageAndCustomizedSettings.parameters = {
  controls: {
    include: [
      'imageSource',
      'iouThreshold',
      'maxBoxes',
      'nmsActive',
      'objectDetectionUI',
      'perf',
      'threshold',
      'visual',
    ],
  },
};
