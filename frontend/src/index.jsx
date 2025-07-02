// frontend/src/index.jsx (Absolute Minimum Debug Version)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// We are temporarily removing ALL providers to test the absolute core rendering.
// No Polaris, no App Bridge, no Router, not even the CSS import.

console.log("--- Absolute Minimum index.jsx is running ---");

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
