import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './redux/store'; // Corrected: Import 'store' as a named export
import App from './App.tsx';
import './index.css'; // Global CSS file (no Tailwind here)

// Create a React root and render the App component
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap App with Provider */}
      <App />
    </Provider>
  </React.StrictMode>,
);