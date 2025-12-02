module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'routes/**/*.js',
    '!routes/**/index.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 67,
      lines: 76,
      statements: 76
    }
  },
  setupFiles: ['<rootDir>/jest.setup.js']
};
