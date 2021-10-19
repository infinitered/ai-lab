import React from 'react';
import {storiesOf} from '@storybook/react-native';
import {AILabNativeImage} from 'ai-lab-native';

storiesOf('AILabNativeImage', module).add('to Storybook', () => (
  <AILabNativeImage source={require('./dinner.jpg')} />
));
