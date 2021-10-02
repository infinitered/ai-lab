import React from 'react';
import { AILabImages } from './AILabImages';

export default {
  title: 'Example/Images',
  component: AILabImages,
};

export const withAnImage = () => <AILabImages src={require('./dinner.jpg')} />;
