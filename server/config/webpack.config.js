const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve('./src'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: [/\.(js|jsx|mjs)$/],
        loader: 'babel-loader',
      }
    ]
  },
  node: {
    __dirname: false,
    __filename: false,
  },
}
