const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  // publicPath: "./", // 文件加载设置为相对路径
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: new RegExp("\\.(js|css)$"),
        // test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
        // exclude: /.map$/,
        // deleteOriginalAssets: "keep-source-map"
      })
    ]
  }
};
