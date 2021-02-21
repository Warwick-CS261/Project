const path = require('path');

module.exports = {
  entry: './js/App.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './js/dist'),
    filename: 'index.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './js/dist'),
  },
};