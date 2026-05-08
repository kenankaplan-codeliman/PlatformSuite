import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ActivityEntityTypesProvider,
  AppProviders,
  AppMetaProvider,
  type EntityLookupOption,
} from '@platform/ui';
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

function CrmActivityEntityTypes({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('app.crm');
  const regardingEntityTypes: EntityLookupOption[] = [
    { entityType: 'Account', label: t('entities.account', { defaultValue: 'Firma' }) },
    { entityType: 'Contact', label: t('entities.contact', { defaultValue: 'Kişi' }) },
    { entityType: 'Lead', label: t('entities.lead', { defaultValue: 'Aday' }) },
    { entityType: 'Opportunity', label: t('entities.opportunity', { defaultValue: 'Fırsat' }) },
  ];
  const partyEntityTypes: EntityLookupOption[] = [
    { entityType: 'User', label: t('entities.user', { defaultValue: 'Kullanıcı' }) },
    { entityType: 'Contact', label: t('entities.contact', { defaultValue: 'Kişi' }) },
    { entityType: 'Account', label: t('entities.account', { defaultValue: 'Firma' }) },
    { entityType: 'Lead', label: t('entities.lead', { defaultValue: 'Aday' }) },
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
      <CrmAppMeta>
        <CrmActivityEntityTypes>
          <RouterProvider router={router} />
        </CrmActivityEntityTypes>
      </CrmAppMeta>
    </AppProviders>
  );
}
