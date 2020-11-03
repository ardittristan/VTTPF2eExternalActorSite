/**
 * builds the site into seperate files for easier debugging
 */
const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    entry: {                                            // files to export as seperate files (that aren't included via `import` statements)
        index: ['babel-polyfill', './src/index.js'],
        populatesheet: './src/populatesheet.js',
        fontawesome: './src/libs/fontawesome.js',
        global: './src/global.js'
    },
    performance: {
        hints: false        // disables warning about big file sizes
    },
    optimization: {
        minimize: false,     // disable if releasing
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
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            { test: /\.(js)$/, exclude: /node_modules/, use: ['babel-loader'] },
            { test: /\.handlebars$/, loader: "handlebars-loader?helperDirs[]=" + __dirname + "/src/handlebars/helpers" },
            { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
            { test: /\.s[ac]ss$/i, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']}
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    plugins: [
        new MiniCssExtractPlugin(),

        new CopyPlugin({                // copies fonts folder if used
            patterns: [
                { from: path.resolve(__dirname, 'src', 'fonts'), to: path.resolve(__dirname, 'dist', 'fonts') }
            ]
        }),

        new FileManagerPlugin({         // moves fontawesome into libs folder in dist folder
            onEnd: [
                {
                    mkdir: [
                        path.resolve(__dirname, 'dist', 'libs')
                    ]
                },
                {
                    move: [
                        { source: path.resolve(__dirname, 'dist', 'fontawesome.js'), destination: path.resolve(__dirname, 'dist', 'libs', 'fontawesome.js') }
                    ]
                }
            ]
        })
    ]
};
