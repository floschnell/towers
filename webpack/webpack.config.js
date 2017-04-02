var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './index.web.js',
  output: {
    publicPath: '/game/',
    filename: './dist/towers.js'
  },
  resolve: {
    extensions: [ '.js', '.jsx' ],
    modules: [ path.resolve('./src'), 'node_modules' ]
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        use: [{
          loader: 'url-loader'
        }]
      },
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-1']
          }
        }]
      },
      {
        test: /node_modules\/svg-inline-react\/(.*)\.js/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-1']
          }
        }]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: [
          'svg-inline-loader'
        ]
      },
      {
        test: /\.json$/,
        use: [
          'json-loader'
        ]
      }
    ]
  }, plugins: [
    new webpack.NormalModuleReplacementPlugin(/\/native\//, function (resource) {
      resource.request = resource.request.replace('/native/', '/web/');
      return resource;
    })
  ]
};