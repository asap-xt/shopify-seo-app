// frontend/src/index.jsx (Final Debug Version)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// This log MUST appear in the correct browser console.
console.log('[AI SEO App] index.jsx is executing...');

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('[AI SEO App] Found root element. Mounting React app...');
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // This will tell us if the HTML is wrong.
  console.error('[AI SEO App] FATAL: Could not find root element with id="root". React cannot mount.');
}
