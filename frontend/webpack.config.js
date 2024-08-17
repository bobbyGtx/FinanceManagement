const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/app.js',//основной файл js точка входа
    mode: 'development',
    output: {
        filename: 'app.js', //генерируемый файл js
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/"//Настройка для того, чтоб файл app.js подключался в index.html со /.
        // Чтоб файл скрипта запрашивался с абсолютного пути.. Это нужно когда мы заходим на сайт сразу на грубину 3 уровня вложенности
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9001,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html" //указываем наш файл
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/images", to: "images"},
                {from: "./src/static/fonts", to: "fonts"},
                {from: "./node_modules/@fortawesome/fontawesome-free/webfonts", to: "webfonts"},
                {from: "./node_modules/@fortawesome/fontawesome-free/css/all.min.css", to: "css/fontawesome.css"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css"},
                {from: "./node_modules/@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css", to: "css"},
                {from: "./node_modules/@popperjs/core/dist/umd/popper.min.js", to: "js"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/@eonasdan/tempus-dominus/dist/js/tempus-dominus.min.js", to: "js"},
                {from: "./node_modules/chart.js/dist/chart.umd.js", to: "js"},
            ],
        }),
    ],
};