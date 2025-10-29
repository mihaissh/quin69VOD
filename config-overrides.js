const webpack = require('webpack');

module.exports = function override(config, env) {
  // Production optimizations
  if (env === 'production') {
    // Optimize code splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Default vendors chunk - let React Scripts handle the naming
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          // Common code shared across pages
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      // Runtime chunk - use single runtime chunk
      runtimeChunk: 'single',
      // Use TerserPlugin for better minification
      minimize: true,
      usedExports: true, // Tree shaking
    };

    // Performance hints - set to warning to not fail builds
    config.performance = {
      ...config.performance,
      hints: 'warning',
      maxAssetSize: 800000, // 800 KiB - realistic for Video.js and vendors
      maxEntrypointSize: 1200000, // 1.2 MiB - reasonable for initial load
    };

    // Add compression plugin for better asset compression
    config.plugins.push(
      new webpack.optimize.ModuleConcatenationPlugin(), // Scope hoisting
    );
  }

  // Development optimizations
  if (env === 'development') {
    // Faster rebuilds in development
    config.optimization = {
      ...config.optimization,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    };
  }

  return config;
};
