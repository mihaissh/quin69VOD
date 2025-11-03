// Optimized config to reduce duplicate JavaScript modules
module.exports = function override(config, env) {
  // Only apply optimizations in production
  if (env === 'production') {
    // Adjust performance warnings
    if (config.performance) {
      config.performance.hints = 'warning';
      config.performance.maxEntrypointSize = 512000;
      config.performance.maxAssetSize = 512000;
    }

    // Optimize chunk splitting to reduce duplicates
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Group all Material-UI components into one vendor chunk
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui-vendor',
            priority: 30,
            reuseExistingChunk: true,
          },
          // Group React and related libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|scheduler)[\\/]/,
            name: 'react-vendor',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Group emotion styling libraries
          emotion: {
            test: /[\\/]node_modules[\\/]@emotion[\\/]/,
            name: 'emotion-vendor',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Group babel runtime helpers
          babel: {
            test: /[\\/]node_modules[\\/]@babel[\\/]runtime[\\/]/,
            name: 'babel-vendor',
            priority: 15,
            reuseExistingChunk: true,
          },
          // Other vendor libraries
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          // Common chunks used across multiple entry points
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        minSize: 20000,
      },
      // Enable module concatenation for better tree-shaking
      concatenateModules: true,
      // Keep runtime chunk separate
      runtimeChunk: {
        name: 'runtime',
      },
    };
  }
  
  return config;
};
