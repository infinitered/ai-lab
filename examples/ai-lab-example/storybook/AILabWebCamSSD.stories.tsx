import React from 'react';
import {
  AILabWebCam,
  AILabObjectDetectionUI,
  SimpleObjectDetectionUI,
} from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CLASSES } from './labels';

export default {
  title: 'Example/AILabVideo/AILabWebCam/SSD Model',
  component: AILabWebCam,
  argTypes: {
    objectDetectionUI: {
      options: ['ai-lab', 'simple'],
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
  },
} as ComponentMeta<typeof AILabWebCam>;

////////////////////////////////////////////////////////////////
//                  WebCam Defaults
////////////////////////////////////////////////////////////////

const webCamStory: ComponentStory<typeof AILabWebCam> = (args, { loaded }) => {
  return (
    <AILabWebCam //@ts-ignore
      ObjectDetectionUI={args.objectDectionUI}
      model={loaded.SSDModel}
      style={{ height: '100%' }}
      modelConfig={{
        modelType: 'ssd',
      }}
      visual={args.visual}
    />
  );
};

export const withAWebCamDefaults = webCamStory.bind({});
withAWebCamDefaults.args = {
  //@ts-ignore
  objectDetectionUI: 'ai-lab',
  visual: true,
};
withAWebCamDefaults.parameters = {
  controls: { include: [] },
};

////////////////////////////////////////////////////////////////
//                  WebCam with Params
////////////////////////////////////////////////////////////////
const webCamParamsStory: ComponentStory<typeof AILabWebCam> = (
  args,
  { loaded }
) => (
  <AILabWebCam
    perf={args.perf}
    model={loaded.SSDModel}
    ObjectDetectionUI={
      //@ts-ignore
      args.objectDetectionUI === 'simple'
        ? SimpleObjectDetectionUI
        : AILabObjectDetectionUI
    }
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
    displaySize={args.displaySize}
  />
);

export const withWebCamAndCustomizedSettings = webCamParamsStory.bind({});
withWebCamAndCustomizedSettings.args = {
  //@ts-ignore
  iouThreshold: 0.5,
  labels: CLASSES.join(', '),
  maxResults: 20,
  nmsActive: true,
  objectDetectionUI: 'ai-lab',
  perf: "simple",
  threshold: 0.4,
  visual: true,
  displaySize: 'content',
};

withWebCamAndCustomizedSettings.parameters = {
  controls: {
    include: [
      // 'imageSource',
      'iouThreshold',
      'labels',
      'maxResults',
      'nmsActive',
      'objectDetectionUI',
      'perf',
      'threshold',
      'visual',
      'displaySize',
    ],
  },
};
