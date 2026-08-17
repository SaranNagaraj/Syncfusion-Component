import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerLicense } from '@syncfusion/ej2-base';

// Register your Syncfusion license key below
registerLicense('Ngo9BigBOggjHTQxAR8/V1JAaF5cX2pCdkx3QHxbf1x2ZFRHal9QTnZbUiweQnxTdENjUX5acHBWQWVUUEdwWUleZw==');


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
