// frontend/src/index.jsx
// This is the main entry point for the React application.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import AppBridgeProvider from './providers/AppBridgeProvider.jsx';
import PolarisProvider from './providers/PolarisProvider.jsx';
import QueryProvider from './providers/QueryProvider.jsx';

// Import i18n configuration to initialize it
import './i18n';

// Import Shopify Polaris base styles
import '@shopify/polaris/build/esm/styles.css';
// Import custom styles
import './styles/main.css';


// The root element in public/index.html
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Provides React Query client throughout the app */}
      <QueryProvider>
        {/* Provides Shopify App Bridge context */}
        <AppBridgeProvider>
          {/* Provides Shopify Polaris theme and i18n */}
          <PolarisProvider>
            <App />
          </PolarisProvider>
        </AppBridgeProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
