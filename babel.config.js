module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src', './assets'],
        alias: {
          '@': './src',
          '@assets': './assets',
        },
      },
    ],
  ],
};
