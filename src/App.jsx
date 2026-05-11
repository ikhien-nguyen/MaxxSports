import React, { useEffect } from 'react';
import './styles/global.css'
import './App.css'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  useEffect(() => {
    // 1. Force the Tab Title
    document.title = "XSPORT";
    
    // 2. Remove default Vite favicon and set a new one
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🟡</text></svg>';
  }, []);

  return <AppRoutes />
}
