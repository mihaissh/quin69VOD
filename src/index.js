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