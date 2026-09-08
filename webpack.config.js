const path = require('path');

module.exports = {
    entry: './src/index.js', // Change this to the main entry point of your application
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            util: require.resolve('util/'),
            fs: path.resolve(__dirname, 'mockFs.js'),
            stream: path.resolve(__dirname, 'mockStream.js'),
            child_process: path.resolve(__dirname, 'mockChildProcess.js'),
            crypto: require.resolve('crypto-browserify'), // Added fallback for crypto
        },
    },
};
