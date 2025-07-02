// frontend/src/App.jsx (Final Debug Version)
import React from 'react';

function App() {
  console.log('[AI SEO App] App.jsx component is rendering.');

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      right: '10px',
      bottom: '10px',
      border: '10px solid limegreen',
      backgroundColor: 'white',
      padding: '20px',
      fontFamily: 'monospace',
      zIndex: 9999,
    }}>
      <h1 style={{ fontSize: '24px', color: 'black' }}>ДИАГНОСТИЧЕН ЕКРАН</h1>
      <p style={{ color: 'black' }}>
        Ако виждате този текст със зелена рамка, това означава:
      </p>
      <ul style={{ color: 'black' }}>
        <li>✅ HTML файлът е зареден правилно.</li>
        <li>✅ JavaScript файлът е зареден и се изпълнява.</li>
        <li>✅ React работи и рендира компоненти.</li>
      </ul>
      <p style={{ color: 'black' }}>
        Проблемът, който причинява белия екран, е в един от "Provider" компонентите, които обвиват това приложение (BrowserRouter, PolarisProvider, AppBridgeProvider).
      </p>
      <p style={{ color: 'black' }}>
        Следващата стъпка е да ги връщаме един по един, за да намерим виновника.
      </p>
    </div>
  );
}

export default App;
