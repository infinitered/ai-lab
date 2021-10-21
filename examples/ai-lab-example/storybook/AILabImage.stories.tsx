import React from 'react';
import { AILabImage } from 'ai-lab';

export default {
  title: 'Example/AILabImage',
  component: AILabImage,
};

export const withAnImage = () => <AILabImage src={require('./dinner.jpg')} />;
