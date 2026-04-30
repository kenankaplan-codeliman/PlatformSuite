import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DetailPageLayout } from '../../../../shared/ui/detail-page/DetailPageLayout';
import { FormSection } from '../../../../shared/ui/form/FormSection';
import { TextField } from '../../../../shared/ui/form/fields/TextField';
import { TextAreaField } from '../../../../shared/ui/form/fields/TextAreaField';
import { useRouteMode } from '../../../../shared/hooks/useRouteMode';
import { useAppRoleQuery } from '../../../../entities/app-role/api/useAppRoleQueries';
import {
  useDeleteAppRole,
  useUpsertAppRole,
} from '../../../../entities/app-role/api/useAppRoleMutations';
import { appRoleSchema } from '../../../../entities/app-role/model/schema';
import type { AppRoleFormValues } from '../../../../entities/app-role/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyAppRole: AppRoleFormValues = {
  id: '',
  roleName: '',
  description: null,
  isDefault: false,
  isActive: true,
  privileges: [],
};

export function AppRoleDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.app-roles-detail');
  const { t: tEntity } = useTranslation('entity.app-role');

  const query = useAppRoleQuery(id);
  const upsert = useUpsertAppRole();
  const deleteMutation = useDeleteAppRole();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.roleName ?? tPage('viewTitle');
  }, [mode, query.data?.roleName, tPage]);

  return (
    <DetailPageLayout<AppRoleFormValues>
      mode={mode}
      title={title}
      schema={appRoleSchema}
      defaultValues={emptyAppRole}
      data={query.data as AppRoleFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.AppRoleView(saved.id)}
    >
      <GeneralSection />
    </DetailPageLayout>
  );

  function GeneralSection() {
    const form = useFormContext<AppRoleFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="roleName"
          control={form.control}
          label={tEntity('fields.roleName.label')}
          placeholder={tEntity('fields.roleName.placeholder')}
          required
          maxLength={100}
        />
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity('fields.description.label')}
          placeholder={tEntity('fields.description.placeholder')}
          rows={3}
          maxLength={1000}
        />
      </FormSection>
    );
  }
}
