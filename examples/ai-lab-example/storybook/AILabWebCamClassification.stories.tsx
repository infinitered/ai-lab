import React from 'react';
import { AILabWebCam } from 'ai-lab';
import { ComponentStory, ComponentMeta } from '@storybook/react';

const CLASSES = ['Drawing', 'Hentai', 'Neutral', 'Porn', 'Sexy'];

export default {
  title: 'Example/AILabVideo/AILabWebCam/Classification Model',
  component: AILabWebCam,
  argTypes: {
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
} as ComponentMeta<typeof AILabWebCam>;

////////////////////////////////////////////////////////////////
//                  WebCam Defaults
////////////////////////////////////////////////////////////////

const webCamStory: ComponentStory<typeof AILabWebCam> = (args, { loaded }) => {
  return (
    <AILabWebCam
      model={loaded.ClassificationModel}
      modelConfig={{
        modelType: 'classification',
      }}
      style={{ height: '100%' }}
    />
  );
};

export const withAWebCamDefaults = webCamStory.bind({});
// withAWebCamDefaults.args = {};  * add args as needed
withAWebCamDefaults.parameters = {
  controls: { include: [] },
};

////////////////////////////////////////////////////////////////
//                  WebCam with Params
////////////////////////////////////////////////////////////////
const webCamParamsStory: ComponentStory<typeof AILabWebCam> = (
  args,
  { loaded }
) => {
  return (
    <AILabWebCam
      perf={args.perf}
      model={loaded.ClassificationModel}
      size={224}
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
export const withWebCamAndCustomizedSettings = webCamParamsStory.bind({});
withWebCamAndCustomizedSettings.args = {
  //@ts-ignore
  maxResults: 5, //topk
  perf: "simple",
  threshold: 0.4,
  labels: CLASSES.join(', '),
  displaySize: 'content',
};

withWebCamAndCustomizedSettings.parameters = {
  controls: {
    include: ['maxResults', 'perf', 'threshold', 'labels', 'displaySize'],
  },
};
