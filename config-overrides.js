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
    config.output.publicPath = '/';

    config.plugins.push(
      new ModuleFederationPlugin({
        name: 'sgpHost',
        remotes: {
          smeNovaSondagem: 'smeNovaSondagem@http://localhost:5173/assets/remoteEntry.js',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^19.2.8',
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^19.2.8',
            eager: true,
          },
          'react-redux': {
            singleton: true,
            requiredVersion: '^8.1.3',
            eager: true,
          },
          redux: {
            singleton: true,
            requiredVersion: '^4.0.4',
            eager: true,
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.10.0',
            eager: true,
          },
          antd: {
            singleton: true,
            requiredVersion: '^5.4.0',
            eager: true,
          },
          '@reduxjs/toolkit': {
            singleton: true,
            requiredVersion: '^1.9.7',
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
