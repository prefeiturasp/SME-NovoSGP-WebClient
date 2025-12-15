// eslint-disable-next-line @typescript-eslint/no-var-requires
const { addBabelPlugin, override, overrideDevServer } = require('customize-cra');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

const moduleFederationConfig = override(
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
  (config) => {
    config.output.publicPath = 'auto';

    config.plugins.push(
      new ModuleFederationPlugin({
        name: 'sgpHost',
        remotes: {
          smeNovaSondagem: 'smeNovaSondagem@http://localhost:5173/assets/remoteEntry.js',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true,
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.10.0',
            eager: true,
          },
        },
      }),
    );
    return config;
  },
);

const devServerConfig = () => (config) => {
  return {
    ...config,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  };
};

module.exports = {
  webpack: moduleFederationConfig,
  devServer: overrideDevServer(devServerConfig()),
};
