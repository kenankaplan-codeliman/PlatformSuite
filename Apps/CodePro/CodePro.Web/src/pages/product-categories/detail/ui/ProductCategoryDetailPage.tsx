import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentPanel,
  DetailPageLayout,
  FormSection,
  SelectField,
  TextAreaField,
  TextField,
  useRouteMode,
} from '@platform/ui';
import {
  useProductCategoryListQuery,
  useProductCategoryQuery,
} from '../../../../entities/product-category/api/useProductCategoryQueries';
import {
  useDeleteProductCategory,
  useUpsertProductCategory,
} from '../../../../entities/product-category/api/useProductCategoryMutations';
import { productCategorySchema } from '../../../../entities/product-category/model/schema';
import type { ProductCategoryFormValues } from '../../../../entities/product-category/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyProductCategory: ProductCategoryFormValues = {
  id: '',
  name: '',
  code: null,
  description: null,
  parentCategoryId: null,
  isActive: true,
};

export function ProductCategoryDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.product-categories-detail');
  const { t: tEntity } = useTranslation('entity.product-category');

  const query = useProductCategoryQuery(id);
  const upsert = useUpsertProductCategory();
  const deleteMutation = useDeleteProductCategory();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.title ?? query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.title, query.data?.name, tPage]);

  return (
    <DetailPageLayout<ProductCategoryFormValues>
      mode={mode}
      title={title}
      schema={productCategorySchema}
      defaultValues={emptyProductCategory}
      data={query.data as ProductCategoryFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.ProductCategoryView(saved.id)}
    >
      <GeneralSection currentId={id} />
      <AttachmentPanel entityType="ProductCategory" entityId={id} />
    </DetailPageLayout>
  );

  function GeneralSection({ currentId }: { currentId: string | undefined }) {
    const form = useFormContext<ProductCategoryFormValues>();
    const parentListQuery = useProductCategoryListQuery({
      pageSize: 200,
      filters: { isActive: true },
    });

    const parentOptions = useMemo(() => {
      const items = parentListQuery.data?.pages.flatMap((p) => p.data) ?? [];
      return items
        .filter((c) => c.id !== currentId)
        .map((c) => ({ value: c.id, label: c.title || c.name }));
    }, [parentListQuery.data, currentId]);

    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="name"
          control={form.control}
          label={tEntity('fields.name.label')}
          placeholder={tEntity('fields.name.placeholder')}
          required
          maxLength={150}
        />
        <TextField
          name="code"
          control={form.control}
          label={tEntity('fields.code.label')}
          placeholder={tEntity('fields.code.placeholder')}
          maxLength={50}
        />
        <SelectField
          name="parentCategoryId"
          control={form.control}
          options={parentOptions}
          label={tEntity('fields.parentCategoryId.label')}
          placeholder={tEntity('fields.parentCategoryId.placeholder')}
          allowClear
        />
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity('fields.description.label')}
          placeholder={tEntity('fields.description.placeholder')}
          maxLength={500}
          rows={3}
        />
      </FormSection>
    );
  }
}
