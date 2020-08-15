const autoprefixer = require('autoprefixer');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('../paths');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const cssFilename = 'static/css/main.bundle.css';
const miniCssExtractPluginOptions = shouldUseRelativeAssetPaths ? { publicPath: Array(cssFilename.split('/').length).join('../') } : {};

module.exports = {
    target: 'web',
    entry: ['@babel/polyfill', paths.appClientIndexJs],
    output: {
        path: paths.appBuild,
        filename: 'static/js/main.bundle.js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath: publicPath,
        devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                oneOf: [
                    {
                        test: [/\.svg/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    },
                    {
                        test: /\.(js|json)$/,
                        include: paths.appSrc,
                        exclude: [/\.(native.js)$/],
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: true,
                            cacheDirectory: true,
                            presets: ['@babel/env']
                        },
                    },
                    {
                        test: /\.css$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options: miniCssExtractPluginOptions
                            },
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    sourceMap: true,
                                }
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9'
                                            ],
                                            flexbox: 'no-2009'
                                        }),
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.(js|json)$/, /\.html$/, /\.json$/],
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: cssFilename,
            chunkFilename: 'static/css/[name].[chunkhash:8].chunk.css'
        })
    ],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
};