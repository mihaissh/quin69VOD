import { lazy } from "react";

/**
 * Enhanced lazy loading with retry logic
 * Retries failed chunk loads up to 3 times before failing
 */
export const lazyRetry = (componentImport, retries = 3, interval = 1000) => {
  return lazy(() =>
    new Promise((resolve, reject) => {
      const attemptLoad = (attemptsLeft) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (attemptsLeft === 1) {
              reject(error);
              return;
            }
            
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `Failed to load component, retrying... (${retries - attemptsLeft + 1}/${retries})`
              );
            }
            
            setTimeout(() => {
              attemptLoad(attemptsLeft - 1);
            }, interval);
          });
      };

      attemptLoad(retries);
    })
  );
};

/**
 * Preload a lazy-loaded component
 */
export const preloadComponent = (lazyComponent) => {
  const component = lazyComponent._payload;
  if (component && component._status === -1) {
    component._result();
  }
};

