/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.js"],

  collectCoverageFrom: ["src/**/*.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  clearMocks: true,
  restoreMocks: true,
};
