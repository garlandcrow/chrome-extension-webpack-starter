const path = require('path')
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin")

const isProd = (process.env.NODE_ENV === 'production')
const buildDir = path.resolve(__dirname, isProd ? 'dist' : 'build')

let config = {
  mode: isProd ? 'production' : 'development',
  entry: {
    popup: path.join(__dirname, "src", "js", "popup.js"),
    options: path.join(__dirname, "src", "js", "options.js"),
    content: path.join(__dirname, "src", "js", "content.js"),
    background: path.join(__dirname, "src", "js", "background.js"),
  },
  output: {
    filename: '[name].bundle.js',
    path: buildDir,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([buildDir]),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, "src", "_locales"),
      to: '_locales'
    }, {
      from: path.join(__dirname, "src", "css"),
      to: 'css'
    }, {
      from: path.join(__dirname, "src", "img"),
      to: 'img'
    }, {
      from: path.join(__dirname, "src", "manifest.json"),
      transform: function (content, _path) {
        // generates the manifest file using the package.json informations
        return Buffer.from(JSON.stringify({
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse(content.toString())
        }))
      }
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "options.html"),
      filename: "options.html",
      chunks: ["options"]
    }),
  ]
}

if (!isProd) {
  config.devtool = 'source-map'
  config.plugins.push(
    new ChromeExtensionReloader({
      entries: {
        options: 'options',
        popup: 'popup',
        content: 'content',
        background: 'background',
      }
    })
  )
}

module.exports = config