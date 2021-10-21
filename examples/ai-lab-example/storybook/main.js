const path = require('path');
const aiLabPath = path.resolve(__dirname, '../../../packages/ai-lab/index.ts');
const reactPath = path.resolve(__dirname, '../../../node_modules/react');
const reactDomPath = path.resolve(__dirname, '../../../node_modules/react-dom');

module.exports = {
  stories: ['*.stories.mdx', '*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (config) => {
    config.resolve.alias = {
      'ai-lab': aiLabPath,
      react: reactPath,
      'react-dom': reactDomPath,
    };
    return config;
  },
};
