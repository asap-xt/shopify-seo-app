// frontend/src/index.jsx (Test 1: Re-introducing Router and Polaris)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import PolarisProvider from './providers/PolarisProvider.jsx';
import QueryProvider from './providers/QueryProvider.jsx';

// Import i18n configuration
import './i18n';

// Import Shopify Polaris base styles
import '@shopify/polaris/build/esm/styles.css';
import './styles/main.css';

console.log("--- Test 1: Re-introducing Router and Polaris ---");

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* We are NOT adding AppBridgeProvider yet */}
      <QueryProvider>
        <PolarisProvider>
          <App />
        </PolarisProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
