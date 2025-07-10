// src/main.tsx or src/index.tsx (pick one depending on your setup)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// This is the entry point for the React application. It renders the main App component into the root element of the HTML.