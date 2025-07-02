// frontend/src/index.jsx (Final Version)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import AppBridgeProvider from './providers/AppBridgeProvider.jsx';
import PolarisProvider from './providers/PolarisProvider.jsx';
import QueryProvider from './providers/QueryProvider.jsx';

// Import i18n configuration
import './i18n';

// Import Shopify Polaris base styles
import '@shopify/polaris/build/esm/styles.css';
import './styles/main.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AppBridgeProvider>
          <PolarisProvider>
            <App />
          </PolarisProvider>
        </AppBridgeProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
