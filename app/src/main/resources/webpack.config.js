const path = require('path');

module.exports = {
  entry: './static/js/index.js',
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
    path: path.resolve(__dirname, './static/js/dist'),
    filename: 'main.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './static/js/dist'),
  },
};