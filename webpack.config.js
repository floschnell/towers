var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: './dist/towers.js',
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};