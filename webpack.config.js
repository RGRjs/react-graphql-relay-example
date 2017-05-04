const path = require('path');

module.exports = {
  entry: "./js/app.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [path.resolve(__dirname, 'babelRelayPlugin')]
        }
      }
    ]
  }
};
