import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppProviders, AppMetaProvider } from '@platform/ui';
import { router } from './app/router/routes';
import codeProLogo from './assets/codepro-logo.png';

function CodeProAppMeta({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('app.codepro');
  return (
    <AppMetaProvider
      logo={
        <img
          src={codeProLogo}
          alt={t('name')}
          height={32}
          style={{ padding: 2, background: '#fff', display: 'block' }}
        />
      }
      appName={t('name')}
      appDescription={t('description')}
    >
      {children}
    </AppMetaProvider>
  );
}

export default function App() {
  return (
    <AppProviders>
      <CodeProAppMeta>
        <RouterProvider router={router} />
      </CodeProAppMeta>
    </AppProviders>
  );
}
