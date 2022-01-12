const path = require('path');

module.exports = {
  stories: ['*.stories.mdx', '*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/preset-create-react-app',
      options: {
        scriptsPackageName: 'react-scripts'
      }
    }
  ],
  webpackFinal: async (config) => {
    // We are an example and therefore we want to use the source because we can!
    config.resolve.alias['ai-lab'] = path.resolve(__dirname, '../../../packages/ai-lab/src');

    return config;
  }
};
