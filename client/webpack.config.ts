const webpack = require("webpack");
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const config = {
    context: __dirname,

    entry: {
        main: ['./src/index.ts'],
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../dist/"),
    },
    mode: 'development',

    plugins: [
        new VueLoaderPlugin(),
        new webpack.SourceMapDevToolPlugin({ filename: '[file].map' }),
    ],

    module: {
        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            {
                test: /\.ts|\.tsx$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            allowTsInNodeModules: true,
                            appendTsSuffixTo: [/\.vue$/],
                            reportFiles: [
                                'src/**/*.{ts,tsx}',
                                '!node_modules/**/*.{ts,tsx}'
                            ]
                        }
                    },
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },

            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: [
                                    'node_modules', 'bower_components', 'src', '.'
                                ]
                            }
                        }
                    },
                ],
                exclude: [
                ]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader'
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.js$/,
                use: [
                    //'babel-loader',
                ]
            }
        ]
    },

    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)

        modules: [
            "node_modules",
            path.resolve("node_modules"),
            path.resolve("src"),
            path.resolve(__dirname, 'src')
        ],
        // directories where to look for modules

        extensions: [".ts", ".vue", ".js", ".json", ".jsx", ".css", ".scss"],
        // extensions that are used
    },
};


module.exports = config;