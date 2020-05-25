module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@constants': './src/constants',
          '@containers': './src/containers',
          '@components': './src/components',
          '@images': './src/assets/images',
        },
      },
    ],
  ],
};
