import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App";
import "simplebar-react/dist/simplebar.min.css";
import { reportWebVitals, logPerformanceMetrics } from "./utils/performanceMonitor";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

// Report web vitals
reportWebVitals((metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric);
  }
  // You can send to analytics endpoint here
});

// Log performance metrics after page load
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(logPerformanceMetrics, 0);
  });
}

// Register service worker for caching and offline support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[SW] Registered:', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });
  });
}