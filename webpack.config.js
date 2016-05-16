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
  devtool: 'eval-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: path.resolve(__dirname, "src"),
        loader: 'babel'
      }
    ]
  },
  plugins: []
};