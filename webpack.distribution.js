const {merge} = require("webpack-merge");
const common = require("./webpack.common")
const ZipPlugin = require("zip-webpack-plugin")
const path = require("path");
const WebpackObfuscatorPlugin = require("webpack-obfuscator");


module.exports = () => {
    return merge(common(), {
        mode: "production",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: [
                        /node_modules/,
                    ],
                    enforce: 'post',
                    use: {
                        loader: WebpackObfuscatorPlugin.loader,
                        options: {
                            rotateStringArray: true
                        }
                    }
                }
            ],
        },
        plugins: [
            new WebpackObfuscatorPlugin({
                    rotateStringArray: true,
                },
            ),
            new ZipPlugin({
                path: path.resolve("bundles"),
                filename: "magically.zip"
            })
        ],
        output: {
            filename: "[name].js"
        }
    })
}