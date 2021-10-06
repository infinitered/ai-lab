import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { AILabNativeImage } from './AILabNativeImage';

storiesOf('AILabNativeImage', module).add('to Storybook', () => (
  <AILabNativeImage source={require('./beach.jpeg')} />
));
