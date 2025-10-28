/**
 * Performance monitoring utilities
 * Tracks Web Vitals and custom metrics
 */

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFCP(onPerfEntry);
      onINP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    }).catch(err => {
      console.warn('Failed to load web-vitals:', err);
    });
  }
};

/**
 * Measure component render time
 */
export const measureRender = (componentName, callback) => {
  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  const measureName = `${componentName}-render`;

  performance.mark(startMark);
  
  const result = callback();
  
  performance.mark(endMark);
  performance.measure(measureName, startMark, endMark);
  
  const measure = performance.getEntriesByName(measureName)[0];
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${componentName} rendered in ${measure.duration.toFixed(2)}ms`);
  }
  
  // Clean up
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(measureName);
  
  return result;
};

/**
 * Monitor API call performance
 */
export const monitorApiCall = async (apiName, apiCall) => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${apiName} completed in ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API] ${apiName} failed after ${duration.toFixed(2)}ms`, error);
    }
    
    throw error;
  }
};

/**
 * Log performance metrics to console (development only)
 */
export const logPerformanceMetrics = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;
  
  console.group('Performance Metrics');
  console.log('Page Load Time:', `${pageLoadTime}ms`);
  console.log('Connection Time:', `${connectTime}ms`);
  console.log('Render Time:', `${renderTime}ms`);
  console.groupEnd();
};

