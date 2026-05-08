import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ActivityEntityTypesProvider,
  AppProviders,
  AppMetaProvider,
  type EntityLookupOption,
} from '@platform/ui';
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

function CodeProActivityEntityTypes({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('app.codepro');
  const regardingEntityTypes: EntityLookupOption[] = [
    { entityType: 'Supplier', label: t('entities.supplier', { defaultValue: 'Tedarikçi' }) },
    { entityType: 'PurchaseOrder', label: t('entities.purchaseOrder', { defaultValue: 'Sipariş' }) },
    { entityType: 'Offer', label: t('entities.offer', { defaultValue: 'Teklif' }) },
    { entityType: 'Contract', label: t('entities.contract', { defaultValue: 'Sözleşme' }) },
    { entityType: 'Budget', label: t('entities.budget', { defaultValue: 'Bütçe' }) },
    { entityType: 'Product', label: t('entities.product', { defaultValue: 'Ürün' }) },
  ];
  const partyEntityTypes: EntityLookupOption[] = [
    { entityType: 'User', label: t('entities.user', { defaultValue: 'Kullanıcı' }) },
    { entityType: 'Supplier', label: t('entities.supplier', { defaultValue: 'Tedarikçi' }) },
  ];
  return (
    <ActivityEntityTypesProvider
      regardingEntityTypes={regardingEntityTypes}
      partyEntityTypes={partyEntityTypes}
    >
      {children}
    </ActivityEntityTypesProvider>
  );
}

export default function App() {
  return (
    <AppProviders>
      <CodeProAppMeta>
        <CodeProActivityEntityTypes>
          <RouterProvider router={router} />
        </CodeProActivityEntityTypes>
      </CodeProAppMeta>
    </AppProviders>
  );
}
