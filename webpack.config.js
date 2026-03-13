const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = __dirname;

const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'index.tsx'),
    path.resolve(appDirectory, 'remote-config-core'),
    path.resolve(appDirectory, 'node_modules/react-native-safe-area-context'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['module:@react-native/babel-preset'],
      plugins: ['react-native-web'],
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

module.exports = {
  entry: [path.resolve(appDirectory, 'index.web.js')],

  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
  },

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, 'index.html'),
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
  ],

  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx'],
  },

  devServer: {
    static: {
      directory: path.resolve(appDirectory, 'dist'),
    },
    compress: true,
    port: 8080,
  },
};
