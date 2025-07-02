// frontend/src/index.jsx (Final Simplified Version)
import React from 'react';
import ReactDOM from 'react-dom/client';
import Entrypoint from './Entrypoint.jsx';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Entrypoint />
  </React.StrictMode>
);
