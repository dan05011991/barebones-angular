
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
    rules: [
      {
        test: /\.js?$/,
        exclude: [
          "/(node_modules)/",
          "/_test_/"
        ],
        use: {
          loader: 'babel-loader'
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
        use: ['style-loader', 'css-loader']
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
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
