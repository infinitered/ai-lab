import React from 'react';
import { AILabImage } from './AILabImage';

export default {
  title: 'Example/AILabImage',
  component: AILabImage,
};

export const withAnImage = () => <AILabImage src={require('./beach.jpeg')} />;
