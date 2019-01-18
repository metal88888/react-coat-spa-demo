const webpack = require("webpack");
const path = require("path");
const fs = require("fs-extra");
const paths = require("../config/paths");

const webpackConfig = require(path.join(paths.configPath, "./webpack.config.prod"));

const compiler = webpack(webpackConfig);

fs.emptyDirSync(paths.distPath);
fs.copySync(paths.publicPath, paths.distPath, {dereference: true});

compiler.run((error, stats) => {
  if (error) {
    console.error(error.stack || error);
    if (error.details) {
      console.error(error.details);
    }
    process.exit(1);
  } else {
    console.info(
      stats.toString({
        entrypoints: false,
        colors: true,
        modules: false,
        excludeAssets: /\.(?!js|html)\w+$/,
        warningsFilter: "[mini-css-extract-plugin]\nConflicting order between",
      })
    );
    if (stats.hasWarnings()) {
      const statsJSON = stats.toJson();
      // Ignore "Conflicting order between" warning, produced by "mini-css-extract-plugin"
      const warnings = statsJSON.warnings.filter(_ => _.indexOf("[mini-css-extract-plugin]\nConflicting order between") < 0);
      if (warnings.length > 0) {
        process.exit(1);
      }
    }
  }
});
