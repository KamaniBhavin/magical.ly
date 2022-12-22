const {merge} = require("webpack-merge");
const common = require("./webpack.common")
const ZipPlugin = require("zip-webpack-plugin")
const path = require("path");


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
        }
    })
}