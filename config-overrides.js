// eslint-disable-next-line @typescript-eslint/no-var-requires
const { addBabelPlugin, override } = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import',
    {
      paths: [
        {
          rootPathSuffix: 'src/@legacy',
          rootPathPrefix: '~/',
        },
        {
          rootPathSuffix: 'src/',
          rootPathPrefix: '@/',
        },
      ],
    },
  ]),
);
