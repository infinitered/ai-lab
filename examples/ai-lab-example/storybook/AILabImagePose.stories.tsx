import React from 'react';
import { AILabImage } from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import * as poseDetection from '@tensorflow-models/pose-detection';

export default {
  title: 'Example/AILabImage/Pose Detection Model',
  component: AILabImage,
  argTypes: {
    imageSource: {
      options: ['exerciser', 'pose1', 'pose2', 'pose3', 'beach'],
      control: { type: 'select' },
    },
    displaySize: {
      options: ['content', 'max'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof AILabImage>;

const gimmeImage = (src: string) => {
  switch (src) {
    case 'exerciser':
      return require('./exerciser.jpg');
    case 'pose1':
      return require('./exercise1.jpg');
    case 'pose2':
      return require('./exercise1.jpg');
    case 'pose3':
      return require('./exercise1.jpg');
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
      model={loaded.BlazePoseModel}
      modelConfig={{
        modelType: 'pose',
      }}
      src={theImage}
      displaySize={args.displaySize}
    />
  );
};

export const withAnImageDefaults = imageStory.bind({});

withAnImageDefaults.args = {
  //@ts-ignore
  imageSource: 'exerciser',
  displaySize: 'content',
};
withAnImageDefaults.parameters = {
  controls: { include: ['imageSource', 'displaySize'] },
};

// TODO: hardcoding pose type and configs (fix this)
withAnImageDefaults.loaders = [
  async () => {
    const blazeModelConfig = await poseDetection.SupportedModels.BlazePose;
    return {
      BlazePoseModel: await poseDetection.createDetector(blazeModelConfig, {
        runtime: 'tfjs',
        modelType: 'full',
      }),
    };
  },
];
