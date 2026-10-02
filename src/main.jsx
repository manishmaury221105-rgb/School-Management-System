import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/components.css';
import { AuthProvider } from './context/AuthContext';
import { SchoolDataProvider } from './context/SchoolDataContext';
import { App } from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SchoolDataProvider>
        <App />
      </SchoolDataProvider>
    </AuthProvider>
  </StrictMode>,
);
