const webpack = require('webpack');

module.exports = function override(config, env) {
  // Production optimizations
  if (env === 'production') {
    // Keep the default Create React App optimization settings
    // Only add non-breaking enhancements
    
    // Tree shaking is already enabled by default
    // Minification is already enabled by default
    // Code splitting is already enabled by default
    
    // Add scope hoisting for better performance
    config.plugins.push(
      new webpack.optimize.ModuleConcatenationPlugin(),
    );

    // Adjust performance hints to not fail builds
    config.performance = {
      ...config.performance,
      hints: 'warning',
      maxAssetSize: 1000000, // 1 MiB
      maxEntrypointSize: 1500000, // 1.5 MiB
    };
  }

  return config;
};
