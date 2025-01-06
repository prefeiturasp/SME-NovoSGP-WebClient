module.exports = {
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "json"],
  coverageDirectory: "coverage",
  preset: 'ts-jest/presets/default-esm',
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
    "^~/(.*)$": "<rootDir>/src/@legacy/$1",

  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/test-utils.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transformIgnorePatterns: [
    "/node_modules/(?!@ant-design|rc-picker|rc-util|@babel/runtime).+\\.js$",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
};
