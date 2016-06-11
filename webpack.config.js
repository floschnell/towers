var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: './dist/towers.js',
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['.js', '.jsx'],
    modulesDirectories: ['node_modules']
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
  },/*
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
        compress: {
            warnings: false
        }
    })
  ]*/
};