import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ActivityEntityTypesProvider,
  AppProviders,
  AppMetaProvider,
  EntityTypeRegistryProvider,
  platformEntityTypes,
} from '@platform/ui';
import { router } from './app/router/routes';
import { crmEntityTypes } from './shared/entity-type/crmEntityTypes';
import crmLogo from './assets/crm-logo.svg';

const crmEntityTypeRegistry = [...platformEntityTypes, ...crmEntityTypes];

const crmRegardingKeys = ['Account', 'Contact', 'Lead', 'Opportunity'] as const;
const crmPartyKeys = ['User', 'Contact', 'Account', 'Lead'] as const;

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
        <EntityTypeRegistryProvider entries={crmEntityTypeRegistry}>
          <ActivityEntityTypesProvider
            regardingKeys={crmRegardingKeys}
            partyKeys={crmPartyKeys}
          >
            <RouterProvider router={router} />
          </ActivityEntityTypesProvider>
        </EntityTypeRegistryProvider>
      </CrmAppMeta>
    </AppProviders>
  );
}
