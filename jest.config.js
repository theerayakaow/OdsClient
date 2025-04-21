// module.exports = {
//   preset: 'react-native',
//   setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
//   transformIgnorePatterns: [
//     'node_modules/(?!(@react-native|react-native|react-navigation|@react-navigation)/)',
//   ],
//   testEnvironment: 'jsdom',
// };
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
