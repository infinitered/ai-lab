import React from 'react';
import {
  AILabWebCam,
  AILabObjectDetectionUI,
  SimpleObjectDetectionUI,
} from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
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
  },
} as ComponentMeta<typeof AILabWebCam>;

////////////////////////////////////////////////////////////////
//                  WebCam Defaults
////////////////////////////////////////////////////////////////

const webCamStory: ComponentStory<typeof AILabWebCam> = ({}, { loaded }) => {
  return <AILabWebCam model={loaded.SSDModel} style={{ height: '100%' }} />;
};

export const withAWebCamDefaults = webCamStory.bind({});
// withAWebCamDefaults.args = {};
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
      args.objectDetectionUI === 'simple'
        ? SimpleObjectDetectionUI
        : AILabObjectDetectionUI
    }
    onInference={action('onInference', args.onInference)}
    perfCallback={action('perfCallback', args.perfCallback)}
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
  perf: true,
  threshold: 0.4,
  visual: true,
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
    ],
  },
};
