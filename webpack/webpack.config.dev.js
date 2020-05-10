const Path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    entry: {
        app: Path.resolve(__dirname, '../examples/src/index.js')
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: false
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: Path.resolve(__dirname, '../examples/src/index.html')
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        port: 3000
    },
});
