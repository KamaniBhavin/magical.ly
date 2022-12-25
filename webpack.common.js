const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = () => {
    return {
        entry: {
            popup: path.resolve("src/popup/index.tsx"),
            gmail: path.resolve("src/content-scripts/gmail/index.tsx"),
            background: path.resolve("src/service-workers/background.ts")
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanStaleWebpackAssets: false
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve("src/static/"),
                        to: path.resolve("dist")
                    }
                ]
            }),
            ...getHtmlPlugins([
                "popup",
                "gmail"
            ])
        ],
        optimization: {
            splitChunks: {
                chunks(chunk) {
                    return chunk.name !== "background" && chunk.name !== "gmail";
                }
            }
        }
    }
}

function getHtmlPlugins(chucks) {
    return chucks.map((chunk) => {
        return new HtmlWebpackPlugin({
            filename: `${chunk}.html`,
            chunks: [chunk],
            template: "src/static/template.html"
        })
    })
}
