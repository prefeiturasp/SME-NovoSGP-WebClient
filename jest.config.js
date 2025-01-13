module.exports = {
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "json"],
  coverageDirectory: "coverage",
  preset: 'ts-jest',
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",  // Usar babel-jest para transformar os arquivos JS, TS, TSX
    "^.+\\.(svg|jpg|jpeg|png|woff|woff2|eot|ttf|otf)$": "jest-transform-stub", // Mockar arquivos de imagem e SVG
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^~/(.*)$": "<rootDir>/src/@legacy/$1",
    "\\.(svg|jpg|jpeg|png|woff|woff2|eot|ttf|otf)$": "<rootDir>/__mocks__/fileMock.js", // Mockar imagens e SVGs
    "\\.(css|less|scss|css\\.js)$": "identity-obj-proxy", // Mockar arquivos CSS e .css.js
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/__mocks__/**",
    "!src/**/*.css.js",  // Excluir arquivos .css.js da coleta de cobertura
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
    "/node_modules/(?!antd|my-library-dir)/",  // Permite que o Jest transforme arquivos dentro de 'antd'
    "/node_modules/(?!react-quill)/"
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/build/",
    "/dist/",
    "/__mocks__/",
    "/src/routes/",
    "/src/core/constants",
    "/src/core/config",
    "/src/core/date",
    "/src/core/dto",
    "/src/core/entities",
    "/src/core/enum",
    "/src/core/hooks",
    "/src/core/redux",
    "/src/core/styles",
    "/src/core/utils",
    "/.*\.d\.ts$/",
    "/.*\.config\.js$/",
    "/.*\.test\.js$/",
    "/.*\.css\.js$/",  
    "/src/index\\.tsx$", 
    "/src/@types",
    "/src/app\\.tsx$", 
    "/.*\\/style\\.js$"
  ],
};
