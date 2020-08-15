const paths = require('../paths');

module.exports = {
    target: 'node',
    entry: ['@babel/polyfill', paths.appServerIndexJs],
    output: {
        path: paths.appBuild,
        filename: 'server/server.bundle.js',
        chunkFilename: 'server/[name].[chunkhash:8].chunk.js'
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(js|json)$/,
                include: paths.appSrc,
                loader: require.resolve('babel-loader'),
                options: {
                    compact: true,
                    cacheDirectory: true,
                    presets: ['@babel/env']
                },
            }
        ]
    }
};