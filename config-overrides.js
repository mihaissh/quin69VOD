// Minimal config - don't override anything that could break React 19
module.exports = function override(config, env) {
  // Only adjust performance warnings to not fail builds
  if (env === 'production' && config.performance) {
    config.performance.hints = 'warning';
  }
  
  return config;
};
