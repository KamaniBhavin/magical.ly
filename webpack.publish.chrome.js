const {merge} = require("webpack-merge");
const common = require("./webpack.common")
const ZipPlugin = require("zip-webpack-plugin")
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");


module.exports = () => {
    return merge(common(), {
        mode: "production",
        plugins: [
            new ZipPlugin({
                path: path.resolve("bundles"),
                filename: "magically.zip"
            })
        ],
        output: {
            filename: "[name].js"
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    minify: TerserPlugin.uglifyJsMinify,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                    }
                })
            ]
        }
    })
}