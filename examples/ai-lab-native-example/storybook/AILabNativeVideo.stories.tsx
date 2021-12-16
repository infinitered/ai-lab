import React from 'react';
import {storiesOf} from '@storybook/react-native';
import {AILabNativeCamera, AILabNativeLocalVideo} from 'ai-lab-native';

storiesOf('AILabNativeVideo', module)
  .add('Local Video', () => <AILabNativeLocalVideo />)
  .add('Camera', () => <AILabNativeCamera />);
