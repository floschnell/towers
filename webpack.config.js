var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: './dist/towers.js'       
  },
  module: {
    loaders: [
      {
        test : /\.jsx?/,
        loader : 'babel'
      }
    ]
  }
};