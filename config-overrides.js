const { override, useBabelRc } = require('customize-cra');

const ignoreWarnings = value => config => {
  config.ignoreWarnings = value;
  return config;
};

module.exports = override(
  useBabelRc(),
  ignoreWarnings([/Failed to parse source map/])
);
