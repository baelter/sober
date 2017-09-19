const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: './example/index.js',
    // Create separate bundle for vendor code
    // vendor: []
  },
  output: {
    path: path.resolve(__dirname, 'example/dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /\.handlebars$/,
        use: ['handlebars-loader']
      },
      {
        test: /\.(js|html)$/,
        exclude: /node_modules/,
        use: ['babel-loader?cacheDirectory=true']
      }
    ]
  },
  plugins: [
    // Clean dist folder every build
    new CleanWebpackPlugin(['example/dist']),
    // Create index.html from template
    new HtmlWebpackPlugin({
      title: 'Sober example',
      template: 'example/index.handlebars'
    }),
    // Cache boilerplate and vendor code separatly
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
    /* new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }) */
  ]
}
