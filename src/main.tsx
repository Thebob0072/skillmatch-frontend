import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './i18n'
import App from './App.tsx'

const rootElement = document.getElementById('root');
if (process.env.NODE_ENV === 'development') {
  console.log('Root element:', rootElement);
  console.log('Starting React app...');
}

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  );
  if (process.env.NODE_ENV === 'development') {
    console.log('React app rendered successfully');
  }
} else {
  if (process.env.NODE_ENV === 'development') {
    console.error('Root element not found!');
  }
}
