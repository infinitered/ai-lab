import React from 'react';
import { AILabWebCam } from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import * as poseDetection from '@tensorflow-models/pose-detection';

export default {
  title: 'Example/AILabVideo/AILabWebCam/Pose Model',
  component: AILabWebCam,
  argTypes: {
    displaySize: {
      options: ['content', 'max'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof AILabWebCam>;

////////////////////////////////////////////////////////////////
//                  WebCam Defaults
////////////////////////////////////////////////////////////////

const webCamStory: ComponentStory<typeof AILabWebCam> = (args, { loaded }) => {
  return (
    <AILabWebCam
      //@ts-ignore
      onInference={action('onInference', args.onInference)}
      //@ts-ignore
      perfCallback={action('perfCallback', args.perfCallback)}
      model={loaded.BlazePoseModel}
      active={args.active}
      modelConfig={{
        modelType: 'pose',
      }}
      displaySize={args.displaySize}
    />
  );
};

export const withAWebCamDefaults = webCamStory.bind({});
// withAWebCamDefaults.args = {};  * add args as needed
withAWebCamDefaults.parameters = {
  controls: { include: ['displaySize', 'active'] },
};

withAWebCamDefaults.args = {
  displaySize: 'content',
};

// TODO: hardcoding pose type and configs (fix this)
withAWebCamDefaults.loaders = [
  async () => {
    const blazeModelConfig = await poseDetection.SupportedModels.BlazePose;
    return {
      BlazePoseModel: await poseDetection.createDetector(blazeModelConfig, {
        runtime: 'tfjs',
        enableSmoothing: true,
        modelType: 'full',
      }),
    };
  },
];
