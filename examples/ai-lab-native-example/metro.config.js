const {getDefaultConfig} = require('metro-config');
const path = require('path');

const aiLabNativePath = path.resolve(__dirname, '../../packages/ai-lab-native');
const aiLabNativeStorybookPath = path.resolve(
  __dirname,
  '../../packages/ai-lab-native/storybook',
);
const reactPath = path.resolve(__dirname, 'node_modules/react');
const reactNativePath = path.resolve(__dirname, 'node_modules/react-native');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  const {assetExts} = defaultConfig.resolver;

  return {
    resolver: {
      assetExts: [...assetExts, 'bin'],
      extraNodeModules: {
        'ai-lab-native': aiLabNativePath,
        'ai-lab-native-storybook': aiLabNativeStorybookPath,
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
})();
