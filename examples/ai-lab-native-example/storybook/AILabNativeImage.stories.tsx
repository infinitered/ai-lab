import React from 'react';
import {storiesOf} from '@storybook/react-native';
import {AILabNativeImage} from 'ai-lab-native';

storiesOf('AILabNativeImage', module)
  .add('Perf', () => <AILabNativeImage perf source={require('./dinner.jpg')} />)
  .add('Basic', () => <AILabNativeImage source={require('./dinner.jpg')} />);
