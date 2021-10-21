const {getDefaultConfig} = require('metro-config');
const path = require('path');
const aiLabNativePath = path.resolve(__dirname, '../../packages/ai-lab-native');
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
        react: reactPath,
        'react-native': reactNativePath,
      },
    },
    watchFolders: [aiLabNativePath],
  };
})();
