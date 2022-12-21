const {merge} = require("webpack-merge");
const common = require("./webpack.common")


module.exports = () => {
    return merge(common(), {
        mode: "development",
        devtool: "cheap-module-source-map",
        output: {
            filename: "[name].js"
        }
    })
}