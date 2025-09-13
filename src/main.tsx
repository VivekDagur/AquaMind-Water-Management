import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initGA, initSession, trackPerformance } from "./utils/analytics";

// Initialize analytics for hackathon demo
initGA();
initSession();

const container = document.getElementById('root');
if (container) {
  ReactDOM.createRoot(container).render(<App />);
  
  // Track performance metrics after app loads
  setTimeout(trackPerformance, 2000);
} else {
  console.error('Root element not found');
}
