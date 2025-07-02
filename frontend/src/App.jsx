// frontend/src/App.jsx (Final "Smart" Diagnostic Version)
// This component has ZERO dependencies and will render a diagnostic panel.

import React, { useMemo } from 'react';

function App() {
  // This is the most robust way to get the config.
  // It reads directly from the browser's URL when the component first loads.
  const diagnosticData = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      shop: params.get('shop'),
      host: params.get('host'),
      apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
      fullUrl: window.location.href, // Get the full URL for inspection
    };
  }, []); // The empty dependency array ensures this runs only once.

  const renderValue = (label, value, isMissing) => (
    <div style={{ marginBottom: '15px' }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{label}:</p>
      <pre style={{
        margin: '5px 0',
        padding: '10px',
        background: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        color: isMissing ? 'red' : 'green',
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap',
      }}>
        {value || (isMissing ? 'MISSING!' : 'EMPTY')}
      </pre>
    </div>
  );

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'monospace',
      border: '5px solid #008060',
      margin: '20px',
      backgroundColor: 'white'
    }}>
      <h1 style={{ fontSize: '24px' }}>App Diagnostics</h1>
      <p>This screen shows the parameters received by the frontend. Please take a screenshot of this and send it back.</p>
      <hr style={{ margin: '20px 0' }} />
      {renderValue('Full URL', diagnosticData.fullUrl)}
      {renderValue('Parsed "shop"', diagnosticData.shop, !diagnosticData.shop)}
      {renderValue('Parsed "host"', diagnosticData.host, !diagnosticData.host)}
      {renderValue('VITE_SHOPIFY_API_KEY', diagnosticData.apiKey, !diagnosticData.apiKey)}
      <hr style={{ margin: '20px 0' }} />
      <p>If all three values above are present, the problem is resolved. We can then restore the main application.</p>
      <p>If any value is 'MISSING!', it needs to be fixed in the server configuration or Shopify Partner settings.</p>
    </div>
  );
}

export default App;