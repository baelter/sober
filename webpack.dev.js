const webpack = require('webpack')
const common = require('./webpack.common.js')
const merge = require('webpack-merge')

module.exports = merge(common, {
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './example/dist',
    hot: true,
    proxy: {
      '/api': {
        target: 'https://localhost:15672/api'
      }
    },
    historyApiFallback: true
  }
})
