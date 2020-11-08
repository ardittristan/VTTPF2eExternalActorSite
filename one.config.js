/**
 * this config packs the site into a single html file
 */
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const HtmlWebpackSkipAssetsPlugin = require('html-webpack-skip-assets-plugin').HtmlWebpackSkipAssetsPlugin;

module.exports = {
    entry: {
        index_bundle: ['babel-polyfill',        // files included in main index.html file
        './src/global.js',
        './src/libs/onefile.js',
        './src/populatesheet.js',
        './src/index.js',
        ],
        fontawesome: './src/libs/fontawesome.js'// seperate fontawesome file for use as cdn for site.
    },
    performance: {
        hints: false                            // disables warning about big file sizes
    },
    optimization: {
        minimize: true,                         // recommended to turn off while coding for easier debugging
        minimizer: [
            new TerserJSPlugin({
                test: /\.js(\?.*)?$/i,
                terserOptions: {
                    module: true
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                }
            })
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'distOne'),
    },
    module: {
        rules: [
            { test: /\.(js)$/, exclude: /node_modules/, use: ['babel-loader'] },
            { test: /\.handlebars$/, loader: "handlebars-loader?helperDirs[]=" + __dirname + "/src/handlebars/helpers" },
            { test: /\.(otf|jpg)$/, use: { loader: 'url-loader' }},
            { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
            { test: /\.hbs$/, loader: "handlebars-loader"},
            { test: /\.s[ac]ss$/i, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']}
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    plugins: [
        new MiniCssExtractPlugin(),

        new HtmlWebpackPlugin({                         // packs everything into one html file
            inlineSource: '.(js|css)$',
            excludeAssets: ['fontawesome.js'],        // what to exclude from the html file
            title: "PF2e Sheet",                          // title of the website
            template: "./src/handlebars/index.hbs",     // template for output index.html
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: false,       // this would break some foundry styling when enabled (<input type="text"> css)
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: false,
                useShortDoctype: true
            }
        }),

        new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),

        new HtmlWebpackSkipAssetsPlugin(),

        new FileManagerPlugin({                         // copies index.html to root folder for easier github pages management.
            onEnd: [
                {
                    copy: [
                        { source: path.resolve(__dirname, 'distOne', 'index.html'), destination: path.resolve(__dirname, 'index.html') }
                    ]
                }
            ]
        })
    ]
};
