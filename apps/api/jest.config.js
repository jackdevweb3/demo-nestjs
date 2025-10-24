module.exports = {
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { diagnostics: false }],
  },
  testEnvironment: 'node',

  setupFiles: ['dotenv/config'],
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^uuid$': 'uuid',
  },
  moduleDirectories: ['node_modules', '.'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  rootDir: '.',
  roots: ['.'],
};
