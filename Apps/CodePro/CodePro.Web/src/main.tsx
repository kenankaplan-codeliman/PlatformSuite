import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Platform i18n init önce; CodePro resources'ları sonradan eklenir.
import '@platform/ui/i18n';
import { registerCodeProTranslations } from './app/i18n.config';
import App from './App';

registerCodeProTranslations();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
