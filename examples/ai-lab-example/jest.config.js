const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
      diagnostics: false,
    },
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
    '.+\\.(jpg|jpeg)$': 'jest-transform-stub',
  },
  // testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/examples/ai-lab-example',
  }),
  moduleDirectories: ['../../packages/ai-lab', 'node_modules'],
  name: 'ai-lab-example',
  rootDir: './../../',
  verbose: true,
};
