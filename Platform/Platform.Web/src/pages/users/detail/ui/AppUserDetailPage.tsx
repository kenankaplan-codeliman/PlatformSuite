import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DetailPageLayout } from '../../../../shared/ui/detail-page/DetailPageLayout';
import { FormSection } from '../../../../shared/ui/form/FormSection';
import { TextField } from '../../../../shared/ui/form/fields/TextField';
import { EntityLookupField } from '../../../../shared/ui/form/fields/EntityLookupField';
import { ServicePath } from '../../../../shared/api/servicePaths';
import { useRouteMode } from '../../../../shared/hooks/useRouteMode';
import { useAppUserQuery } from '../../../../entities/app-user/api/useAppUserQueries';
import {
  useDeleteAppUser,
  useUpsertAppUser,
} from '../../../../entities/app-user/api/useAppUserMutations';
import { appUserSchema } from '../../../../entities/app-user/model/schema';
import type { AppUserFormValues } from '../../../../entities/app-user/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyAppUser: AppUserFormValues = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: null,
  organizationId: '',
  managerId: null,
  isActive: true,
};

export function AppUserDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.users-detail');
  const { t: tEntity } = useTranslation('entity.app-user');

  const query = useAppUserQuery(id);
  const upsert = useUpsertAppUser();
  const deleteMutation = useDeleteAppUser();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data ? `${query.data.firstName} ${query.data.lastName}` : tPage('viewTitle');
  }, [mode, query.data, tPage]);

  const orgInitialLabel = query.data?.organizationName ?? undefined;
  const managerInitialLabel = query.data?.managerName ?? undefined;

  return (
    <DetailPageLayout<AppUserFormValues>
      mode={mode}
      title={title}
      schema={appUserSchema}
      defaultValues={emptyAppUser}
      data={query.data as AppUserFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => {
        await upsert.mutateAsync(values);
      }}
      onDelete={
        id
          ? async () => {
              await deleteMutation.mutateAsync(id);
            }
          : undefined
      }
      afterSaveNavigation={(saved) => RoutePaths.AppUserView(saved.id)}
    >
      <GeneralSection />
      <HierarchySection
        orgInitialLabel={orgInitialLabel}
        managerInitialLabel={managerInitialLabel}
      />
    </DetailPageLayout>
  );

  function GeneralSection() {
    const form = useFormContext<AppUserFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="firstName"
          control={form.control}
          label={tEntity('fields.firstName.label')}
          placeholder={tEntity('fields.firstName.placeholder')}
          required
          maxLength={100}
        />
        <TextField
          name="lastName"
          control={form.control}
          label={tEntity('fields.lastName.label')}
          placeholder={tEntity('fields.lastName.placeholder')}
          required
          maxLength={100}
        />
        <TextField
          name="email"
          control={form.control}
          label={tEntity('fields.email.label')}
          placeholder={tEntity('fields.email.placeholder')}
          required
          maxLength={150}
        />
        <TextField
          name="phoneNumber"
          control={form.control}
          label={tEntity('fields.phoneNumber.label')}
          placeholder={tEntity('fields.phoneNumber.placeholder')}
          maxLength={50}
        />
      </FormSection>
    );
  }

  function HierarchySection({
    orgInitialLabel,
    managerInitialLabel,
  }: {
    orgInitialLabel?: string;
    managerInitialLabel?: string;
  }) {
    const form = useFormContext<AppUserFormValues>();
    return (
      <FormSection title={tEntity('sections.hierarchy')}>
        <EntityLookupField<AppUserFormValues>
          name="organizationId"
          control={form.control}
          servicePath={ServicePath.AppOrganization.List}
          label={tEntity('fields.organization.label')}
          placeholder={tEntity('fields.organization.placeholder')}
          initialLabel={orgInitialLabel}
        />
        <EntityLookupField<AppUserFormValues>
          name="managerId"
          control={form.control}
          servicePath={ServicePath.User.Search}
          label={tEntity('fields.manager.label')}
          placeholder={tEntity('fields.manager.placeholder')}
          initialLabel={managerInitialLabel}
          allowClear
        />
      </FormSection>
    );
  }
}
