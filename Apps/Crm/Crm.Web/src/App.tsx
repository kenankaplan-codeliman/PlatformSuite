import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppProviders, AppMetaProvider } from '@platform/ui';
import { router } from './app/router/routes';
import crmLogo from './assets/crm-logo.svg';

function CrmAppMeta({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('app.crm');
  return (
    <AppMetaProvider
      logo={<img src={crmLogo} alt={t('name')} height={32} />}
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
      <CrmAppMeta>
        <RouterProvider router={router} />
      </CrmAppMeta>
    </AppProviders>
  );
}
