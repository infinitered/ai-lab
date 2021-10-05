import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { AILabNativeImage } from './AILabNativeImage';

storiesOf('AILabNativeImage', module).add('to Storybook', () => (
  <AILabNativeImage src={require('./beach.jpeg')} />
));
