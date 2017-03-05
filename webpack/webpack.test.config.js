var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './tests/index.js',
  output: {
    filename: './test/test.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [ path.resolve('./src'), 'node_modules' ]
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.json$/,
        use: {
          loader: 'json-loader',
        }
      }
    ]
  }
};