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
import { codeproEntityTypes } from './shared/entity-type/codeproEntityTypes';
import codeProLogo from './assets/codepro-logo.png';

const codeproEntityTypeRegistry = [...platformEntityTypes, ...codeproEntityTypes];

const codeproRegardingKeys = [
  'Supplier',
  'PurchaseOrder',
  'Offer',
  'Contract',
  'Budget',
  'Product',
] as const;
const codeproPartyKeys = ['User', 'Supplier'] as const;

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
        <EntityTypeRegistryProvider entries={codeproEntityTypeRegistry}>
          <ActivityEntityTypesProvider
            regardingKeys={codeproRegardingKeys}
            partyKeys={codeproPartyKeys}
          >
            <RouterProvider router={router} />
          </ActivityEntityTypesProvider>
        </EntityTypeRegistryProvider>
      </CodeProAppMeta>
    </AppProviders>
  );
}
