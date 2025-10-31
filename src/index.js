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
  // You can send to analytics endpoint here
  // Web vitals logging removed to reduce console noise
});

// Log performance metrics after page load
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(logPerformanceMetrics, 0);
  });
}

// Unregister any existing service workers
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
        console.log('[SW] Unregistered old service worker');
      });
    });
  });
}

