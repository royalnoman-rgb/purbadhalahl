
const originalError = console.error;
console.error = (...args) => {
  if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('Quota exceeded')) return;
  if (args.length > 0 && args[0]?.message?.includes('Quota exceeded')) return;
  originalError(...args);
};

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('Quota exceeded')) return;
  if (args.length > 0 && args[0]?.message?.includes('Quota exceeded')) return;
  originalWarn(...args);
};

window.addEventListener('error', (e) => {
  if (e.message?.includes('Quota exceeded') || e.error?.message?.includes('Quota exceeded')) {
    e.preventDefault();
  }
});
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message?.includes('Quota exceeded') || (typeof e.reason === 'string' && e.reason.includes('Quota exceeded'))) {
    e.preventDefault();
  }
});


import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Admin from './Admin.tsx';
import './index.css';

// Unregister any existing service workers to ensure fresh cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
