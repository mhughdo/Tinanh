/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { assetExts, sourceExts } = require('metro-config/src/defaults/defaults');
const { getDefaultConfig, mergeConfig } = require('metro-config');

const cfg = async () => await getDefaultConfig();

module.exports = mergeConfig(cfg, {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
});
