var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './tests/index.js',
  output: {
    filename: './test/test.js',
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['.js', '.jsx'],
    modulesDirectories: ['node_modules']
  },
  devtool: 'source-maps',
  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};