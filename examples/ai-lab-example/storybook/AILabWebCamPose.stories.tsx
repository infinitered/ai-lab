import React from 'react';
import { AILabWebCam } from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import * as poseDetection from '@tensorflow-models/pose-detection';

export default {
  title: 'Examples/AILabVideo/AILabWebCam/Pose Model',
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
      model={loaded.BlazePoseModel}
      active={args.active}
      perf={args.perf}
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
  perf: 'simple',
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
