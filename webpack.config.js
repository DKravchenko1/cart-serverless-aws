const path = require('path');

module.exports = () => ({
  mode: 'development',
  target: 'node',
  entry: path.resolve(__dirname) + '/src/main.ts',
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: [[path.resolve(__dirname, 'node_modules')]],
      },
    ],
  },
  output: {
    libraryTarget: 'commonjs2',
  },
});
