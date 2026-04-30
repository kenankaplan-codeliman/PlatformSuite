import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Platform i18n önce init edilir; CRM resources'ları sonradan eklenir.
import '@platform/ui/i18n';
import { registerCrmTranslations } from './app/i18n.config';
import App from './App';

registerCrmTranslations();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
