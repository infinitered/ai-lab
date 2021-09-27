const path = require('path');

const aiLabNativePath = path.resolve(__dirname, '../../packages/ai-lab-native');
const reactPath = path.resolve(__dirname, 'node_modules/react');
const reactNativePath = path.resolve(__dirname, 'node_modules/react-native');

module.exports = {
  resolver: {
    extraNodeModules: {
      'ai-lab-native': aiLabNativePath,
      react: reactPath,
      'react-native': reactNativePath,
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [aiLabNativePath],
};
