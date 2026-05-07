import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DetailPageLayout } from '../../../../shared/ui/detail-page/DetailPageLayout';
import { FormSection } from '../../../../shared/ui/form/FormSection';
import { TextField } from '../../../../shared/ui/form/fields/TextField';
import { TextAreaField } from '../../../../shared/ui/form/fields/TextAreaField';
import {
  SelectField,
  type SelectOption,
} from '../../../../shared/ui/form/fields/SelectField';
import { EntityLookupField } from '../../../../shared/ui/form/fields/EntityLookupField';
import { ServicePath } from '../../../../shared/api/servicePaths';
import { useRouteMode } from '../../../../shared/hooks/useRouteMode';
import { useOrganizationQuery } from '../../../../entities/organization/api/useOrganizationQueries';
import {
  useDeleteOrganization,
  useUpsertOrganization,
} from '../../../../entities/organization/api/useOrganizationMutations';
import { appOrganizationSchema } from '../../../../entities/organization/model/schema';
import type {
  AppOrganizationFormValues,
  OrganizationType,
} from '../../../../entities/organization/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const ORGANIZATION_TYPES: OrganizationType[] = [
  'EXECUTIVE',
  'INTERNAL_SYSTEM',
  'DEPARTMENT',
  'ADVISORY',
  'REGION',
  'BRANCH',
];

const emptyOrganization: AppOrganizationFormValues = {
  id: '',
  organizationCode: '',
  organizationName: '',
  description: '',
  type: 'DEPARTMENT',
  costCenter: null,
  parentOrganization: null,
  reportsTo: null,
  isDefault: false,
  isActive: true,
};

export function OrganizationDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.organizations-detail');
  const { t: tEntity } = useTranslation('entity.organization');
  const { t: tEnums } = useTranslation('enums');

  const query = useOrganizationQuery(id);
  const upsert = useUpsertOrganization();
  const deleteMutation = useDeleteOrganization();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.title ?? query.data?.organizationName ?? tPage('viewTitle');
  }, [mode, query.data?.title, query.data?.organizationName, tPage]);

  const typeOptions: SelectOption<OrganizationType>[] = ORGANIZATION_TYPES.map((value) => ({
    value,
    label: tEnums(`organizationType.${value}`),
  }));

  return (
    <DetailPageLayout<AppOrganizationFormValues>
      mode={mode}
      title={title}
      schema={appOrganizationSchema}
      defaultValues={emptyOrganization}
      data={query.data as AppOrganizationFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.OrganizationView(saved.id)}
    >
      <GeneralSection typeOptions={typeOptions} />
      <HierarchySection />
    </DetailPageLayout>
  );

  function GeneralSection({ typeOptions }: { typeOptions: SelectOption<OrganizationType>[] }) {
    const form = useFormContext<AppOrganizationFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="organizationCode"
          control={form.control}
          label={tEntity('fields.organizationCode.label')}
          placeholder={tEntity('fields.organizationCode.placeholder')}
          required
          maxLength={50}
        />
        <TextField
          name="organizationName"
          control={form.control}
          label={tEntity('fields.organizationName.label')}
          placeholder={tEntity('fields.organizationName.placeholder')}
          required
          maxLength={150}
        />
        <SelectField<AppOrganizationFormValues, OrganizationType>
          name="type"
          control={form.control}
          label={tEntity('fields.type.label')}
          options={typeOptions}
          required
        />
        <TextField
          name="costCenter"
          control={form.control}
          label={tEntity('fields.costCenter.label')}
          maxLength={100}
        />
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity('fields.description.label')}
          rows={3}
        />
      </FormSection>
    );
  }

  function HierarchySection() {
    const form = useFormContext<AppOrganizationFormValues>();
    return (
      <FormSection title={tEntity('sections.hierarchy')}>
        <EntityLookupField
          name="parentOrganization"
          control={form.control}
          servicePath={ServicePath.AppOrganization.Search}
          label={tEntity('fields.parentOrganization.label')}
          allowClear
        />
        <EntityLookupField
          name="reportsTo"
          control={form.control}
          servicePath={ServicePath.AppOrganization.Search}
          label={tEntity('fields.reportsTo.label')}
          allowClear
        />
      </FormSection>
    );
  }
}
