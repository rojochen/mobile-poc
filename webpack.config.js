var webpack = require("webpack");
var webpack = require("webpack");
var webpackStream = require('webpack-stream');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');


module.exports = {
    entry: ['./src/config.js', './src/style.js'],
    devtool: "eval-cheap-module-source-map",
    cache: true,
    output: {
        publicPath: "assets/js/",
        filename: "app.js"
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        alias: {
            framework7: 'framework7/dist/js/framework7.min',
            angular: 'angular/angular.min',
            ngTouch: 'angular-touch/angular-touch.min',
            ngMock: 'angular-mocks/angular-mocks',
            ngCookie: 'angular-cookies/angular-cookies.min'
        },
        extensions: ['', '.js']
    },
    module: {
        loaders: [{
            test: /\.png$/,
            loader: 'url-loader?limit=100000'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style", "css!sass!postcss")
                // loader: ExtractTextPlugin.extract("style", "css?modules!sass!postcss")
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style", "css!sass!postcss")
        }, {
            test: /\.(jpg|png|woff|svg|ttf|eot)([\?]?.*)$/,
            loader: "file-loader?name=../../img/assets/[name].[ext]"
        }]
    },
    postcss: function () {
        return [autoprefixer({
            browsers: [
                'last 2 Chrome versions',
                'last 2 Firefox versions',
                'Explorer >= 11',
                'last 1 Edge versions',
                'last 2 ChromeAndroid versions',
                'Android >= 4.1',
                'safari >= 6',
                'ios >= 6'
            ]
        })];
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     debug: true,
        //     minimize: false,
        //     sourceMap: false,
        //     output: {
        //         comments: false
        //     },
        //     compressor: {
        //         warnings: false
        //     }
        // }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin("../../css/main.css", {
            allChunks: true
        }),
    ],
    devServer: {
        inline: true,
        hot: true,
        port: 3030
    }
}