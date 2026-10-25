import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './brand.css'
import './services.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline destek isteğe bağlıdır. Uygulama, SW olmadan da online çalışır.
    })
  })
}
