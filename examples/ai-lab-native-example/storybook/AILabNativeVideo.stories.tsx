import React from 'react';
import {storiesOf} from '@storybook/react-native';
import {AILabNativeCamera} from 'ai-lab-native';

storiesOf('AILabNativeVideo', module).add('Camera', () => (
  <AILabNativeCamera />
));
