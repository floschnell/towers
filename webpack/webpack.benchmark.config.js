var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './tests/benchmarks.js',
  output: {
      libraryTarget: "commonjs",
    filename: './dist/benchmarks.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [ path.resolve('./src'), path.resolve('./node_modules') ]
  },
  devtool: 'inline-source-map',
  externals: [
      'benchmark'
  ],
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