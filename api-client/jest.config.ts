export default {
  rootDir: 'src/',
  preset: 'ts-jest',
  verbose: true,
  automock: false,
  setupFiles: ['<rootDir>/../jest.setup.ts'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageDirectory: '<rootDir>/../reports/coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(j|t)sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  maxWorkers: '50%',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/../reports/unit-test',
      },
    ],
  ],
}
