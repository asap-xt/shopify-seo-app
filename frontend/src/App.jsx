// frontend/src/App.jsx (Absolute Minimum Debug Version)
// This file is simplified to have ZERO dependencies.

import React from 'react';

function App() {
  // This log MUST appear in the browser console if the component renders.
  console.log("--- Absolute Minimum App.jsx is rendering ---");

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', border: '5px solid red', margin: '20px', backgroundColor: 'white' }}>
      <h1 style={{ fontSize: '24px' }}>Диагностичен Тест</h1>
      <p>
        Ако виждате този текст с червена рамка, значи React работи.
      </p>
      <p>
        Проблемът е в един от "Provider" компонентите (AppBridge, Polaris, или Router), които обвиват това приложение.
      </p>
    </div>
  );
}

export default App;
