import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentPanel,
  DetailPageLayout,
  FormSection,
  TextField,
  useRouteMode,
} from '@platform/ui';
import { useBrandQuery } from '../../../../entities/brand/api/useBrandQueries';
import {
  useDeleteBrand,
  useUpsertBrand,
} from '../../../../entities/brand/api/useBrandMutations';
import { brandSchema } from '../../../../entities/brand/model/schema';
import type { BrandFormValues } from '../../../../entities/brand/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyBrand: BrandFormValues = {
  id: '',
  name: '',
  isActive: true,
};

export function BrandDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.brands-detail');
  const { t: tEntity } = useTranslation('entity.brand');

  const query = useBrandQuery(id);
  const upsert = useUpsertBrand();
  const deleteMutation = useDeleteBrand();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  return (
    <DetailPageLayout<BrandFormValues>
      mode={mode}
      title={title}
      schema={brandSchema}
      defaultValues={emptyBrand}
      data={query.data as BrandFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.BrandView(saved.id)}
    >
      <GeneralSection />
      <AttachmentPanel entityType="Brand" entityId={id} />
    </DetailPageLayout>
  );

  function GeneralSection() {
    const form = useFormContext<BrandFormValues>();
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
