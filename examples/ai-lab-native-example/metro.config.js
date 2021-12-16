const {makeMetroConfig} = require('@rnx-kit/metro-config');
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');

const {getDefaultConfig} = require('metro-config');
// const path = require('path');
// const aiLabNativePath = path.resolve(__dirname, '../../packages/ai-lab-native');
// const reactPath = path.resolve(__dirname, 'node_modules/react');
// const reactNativePath = path.resolve(__dirname, 'node_modules/react-native');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  const {assetExts} = defaultConfig.resolver;
  const symlinkSupport = makeMetroConfig({
    projectRoot: __dirname,
    resolver: {
      resolveRequest: MetroSymlinksResolver(),
    },
  });

  return Object.assign(
    {
      resolver: {
        assetExts: [...assetExts, 'bin'],
        // extraNodeModules: {
        //   'ai-lab-native': aiLabNativePath,
        //   react: reactPath,
        //   'react-native': reactNativePath,
        // },
      },
      // watchFolders: [aiLabNativePath],
    },
    symlinkSupport,
  );
})();
