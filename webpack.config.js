
var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var glob = require("glob");

module.exports = {
  context: __dirname, //path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: {
    bundle: glob.sync("./angular-application/**/*.js")
},
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
        }
      },
      {
          test: /\.html$/,
          loader: 'raw-loader',
          options: {
            relativeTo: path.resolve(__dirname, "app")
          }

      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: "[name].min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};