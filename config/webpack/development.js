/////////////////////Development Mode//////////////////////
'use strict';

process.on('unhandledRejection', err => {
    throw err;
});

const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const merge = require("webpack-merge");
const paths = require('../paths');
const serverConfig = require('./server');
const browserConfig = require('./browser');

console.log('Cleaning build folder!!!');
fs.emptyDirSync(paths.appBuild);
console.log('Clean build folder success!!!');

console.log('Creating optimized development build...');

if (!checkRequiredFiles([paths.appServerIndexJs])) {
    process.exit(1);
}

if (!checkRequiredFiles([paths.appClientIndexJs])) {
    process.exit(1);
}

const commonConfig = {
    mode: 'development',
    bail: false,
    devtool: 'source-map',
    resolve: {
        modules: [paths.appNodeModules],
        extensions: ['.js', '.json'],
        plugins: [
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
        ],
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(js|json)$/,
                enforce: 'pre',
                exclude: /node_modules/,
                use: [
                    {
                        options: {
                            formatter: eslintFormatter,
                            configFile: path.join(__dirname, '../../config/eslint/js/.eslintrc'),
                            emitError: false,
                            emitWarning: true,
                            failOnError: false
                        },
                        loader: require.resolve('eslint-loader')
                    },
                ],
                include: paths.appSrc,
            }
        ]
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CaseSensitivePathsPlugin()
    ],
    performance: {
        hints: "warning"
    }
};

module.exports = [
    merge(commonConfig, serverConfig),
    merge(commonConfig, browserConfig)
];