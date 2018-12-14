const webpack = require('webpack');
const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const config = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'js/bundle.js'
  },
  mode: "development",
  plugins: [
    new LiveReloadPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react']
            }
          }
        ],
      }, {
        test: /\.(scss|ttf|css)/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      }, {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  }
};
module.exports = config;