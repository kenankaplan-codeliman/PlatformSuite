import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentSection,
  DetailPageLayout,
  FormSection,
  TextField,
  useRouteMode,
  type DetailPageTab,
} from '@platform/ui';
import { useManufacturerQuery } from '../../../../entities/manufacturer/api/useManufacturerQueries';
import {
  useDeleteManufacturer,
  useUpsertManufacturer,
} from '../../../../entities/manufacturer/api/useManufacturerMutations';
import { manufacturerSchema } from '../../../../entities/manufacturer/model/schema';
import type { ManufacturerFormValues } from '../../../../entities/manufacturer/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyManufacturer: ManufacturerFormValues = {
  id: '',
  name: '',
  isActive: true,
};

export function ManufacturerDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.manufacturers-detail');
  const { t: tEntity } = useTranslation('entity.manufacturer');
  const { t: tCommon } = useTranslation('common');

  const query = useManufacturerQuery(id);
  const upsert = useUpsertManufacturer();
  const deleteMutation = useDeleteManufacturer();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  const tabs: DetailPageTab[] = [
    {
      key: 'attachments',
      label: tCommon('tabs.attachments'),
      content: <AttachmentSection entityType="Manufacturer" entityId={id} />,
    },
  ];

  return (
    <DetailPageLayout<ManufacturerFormValues>
      mode={mode}
      title={title}
      schema={manufacturerSchema}
      defaultValues={emptyManufacturer}
      data={query.data as ManufacturerFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.ManufacturerView(saved.id)}
      tabs={tabs}
    >
      <GeneralSection />
    </DetailPageLayout>
  );

  function GeneralSection() {
    const form = useFormContext<ManufacturerFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="name"
          control={form.control}
          label={tEntity('fields.name.label')}
          placeholder={tEntity('fields.name.placeholder')}
          required
          maxLength={100}
        />
      </FormSection>
    );
  }
}
