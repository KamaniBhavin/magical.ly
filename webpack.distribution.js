const {merge} = require("webpack-merge");
const common = require("/webpack.common")


module.exports = () => {
    return merge(common(), {
        mode: "production",
        output: {
            filename: "[name].js"
        }
    })
}