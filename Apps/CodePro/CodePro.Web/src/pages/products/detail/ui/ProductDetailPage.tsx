import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentPanel,
  Button,
  DetailPageLayout,
  EntityLookupField,
  FormSection,
  ServicePath,
  TextAreaField,
  TextField,
  useFormMode,
  useRouteMode,
} from '@platform/ui';
import { CodeProServicePath } from '../../../../shared/api/servicePaths';
import { useProductQuery } from '../../../../entities/product/api/useProductQueries';
import {
  useDeleteProduct,
  useUpsertProduct,
} from '../../../../entities/product/api/useProductMutations';
import { productSchema } from '../../../../entities/product/model/schema';
import type { ProductFormValues } from '../../../../entities/product/model/types';
import { RoutePaths } from '../../../../app/router/paths';
import { ProductImagesSection } from '../sections/ProductImagesSection';

const emptyProduct: ProductFormValues = {
  id: '',
  code: '',
  name: '',
  shortDescription: '',
  detailedDescription: null,
  validFrom: new Date().toISOString(),
  validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  unitOfMeasure: null,
  manufacturerPartNumber: null,
  model: null,
  color: null,
  productUrl: null,
  quantityPerUnit: null,
  deliveryDays: 0,
  accountCodeId: null,
  productCategory: null,
  isActive: true,
  brandIds: [],
  manufacturerIds: [],
  keywords: [],
  supplierSkus: [],
};

function mapDataToForm(data: unknown): ProductFormValues | undefined {
  const detail = data as
    | (ProductFormValues & {
        brands?: { brandId: string }[];
        manufacturers?: { manufacturerId: string }[];
      })
    | undefined;
  if (!detail) return undefined;
  return {
    ...detail,
    brandIds: detail.brands?.map((b) => b.brandId) ?? detail.brandIds ?? [],
    manufacturerIds:
      detail.manufacturers?.map((m) => m.manufacturerId) ?? detail.manufacturerIds ?? [],
    keywords: Array.isArray(detail.keywords)
      ? detail.keywords.map((k) => (typeof k === 'string' ? k : (k as { keyword: string }).keyword))
      : [],
    supplierSkus: Array.isArray(detail.supplierSkus)
      ? detail.supplierSkus.map((s) => ({
          supplierAccount: s.supplierAccount ?? null,
          sku: s.sku,
        }))
      : [],
  };
}

export function ProductDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.products-detail');
  const { t: tEntity } = useTranslation('entity.product');

  const query = useProductQuery(id);
  const upsert = useUpsertProduct();
  const deleteMutation = useDeleteProduct();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  const formData = useMemo(() => mapDataToForm(query.data), [query.data]);

  return (
    <DetailPageLayout<ProductFormValues>
      mode={mode}
      title={title}
      schema={productSchema}
      defaultValues={emptyProduct}
      data={formData}
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
      afterSaveNavigation={(saved) => RoutePaths.ProductView(saved.id)}
    >
      <GeneralSection />
      <ValiditySection />
      <KeywordsSection />
      <SupplierSkusSection />
      <ProductImagesSection productId={id} />
      <AttachmentPanel entityType="Product" entityId={id} />
    </DetailPageLayout>
  );

  function GeneralSection() {
    const form = useFormContext<ProductFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="code"
          control={form.control}
          label={tEntity('fields.code.label')}
          placeholder={tEntity('fields.code.placeholder')}
          required
          maxLength={25}
        />
        <TextField
          name="name"
          control={form.control}
          label={tEntity('fields.name.label')}
          placeholder={tEntity('fields.name.placeholder')}
          required
          maxLength={50}
        />
        <TextField
          name="shortDescription"
          control={form.control}
          label={tEntity('fields.shortDescription.label')}
          placeholder={tEntity('fields.shortDescription.placeholder')}
          required
          maxLength={50}
        />
        <TextAreaField
          name="detailedDescription"
          control={form.control}
          label={tEntity('fields.detailedDescription.label')}
          rows={4}
        />
        <EntityLookupField
          name="productCategory"
          control={form.control}
          servicePath={CodeProServicePath.ProductCategory.Search}
          label={tEntity('fields.category.label')}
          placeholder={tEntity('fields.category.placeholder')}
        />
        <TextField
          name="manufacturerPartNumber"
          control={form.control}
          label={tEntity('fields.manufacturerPartNumber.label')}
          maxLength={25}
        />
        <TextField
          name="model"
          control={form.control}
          label={tEntity('fields.model.label')}
          maxLength={25}
        />
        <TextField
          name="color"
          control={form.control}
          label={tEntity('fields.color.label')}
          maxLength={25}
        />
        <TextField
          name="productUrl"
          control={form.control}
          label={tEntity('fields.productUrl.label')}
        />
      </FormSection>
    );
  }

  function ValiditySection() {
    const form = useFormContext<ProductFormValues>();
    return (
      <FormSection title={tEntity('sections.validity')}>
        <TextField
          name="unitOfMeasure"
          control={form.control}
          label={tEntity('fields.unitOfMeasure.label')}
          placeholder={tEntity('fields.unitOfMeasure.placeholder')}
          maxLength={50}
        />
        <TextField
          name="validFrom"
          control={form.control}
          label={tEntity('fields.validFrom.label')}
        />
        <TextField
          name="validUntil"
          control={form.control}
          label={tEntity('fields.validUntil.label')}
        />
      </FormSection>
    );
  }

  function KeywordsSection() {
    const form = useFormContext<ProductFormValues>();
    const { mode: formMode } = useFormMode();
    const isReadOnly = formMode === 'view';

    const { fields, append, remove } = useFieldArray<ProductFormValues>({
      control: form.control,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: 'keywords' as any,
    });

    return (
      <FormSection title={tEntity('sections.classification')}>
        <strong>{tEntity('fields.keywords.label')}</strong>
        {fields.map((field, index) => (
          <div key={field.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <TextField
                name={`keywords.${index}` as const}
                control={form.control}
                label=""
                maxLength={100}
              />
            </div>
            {!isReadOnly && (
              <Button htmlType="button" onClick={() => remove(index)}>
                ×
              </Button>
            )}
          </div>
        ))}
        {!isReadOnly && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Button htmlType="button" onClick={() => append('' as any)}>
            +
          </Button>
        )}
      </FormSection>
    );
  }

  function SupplierSkusSection() {
    const form = useFormContext<ProductFormValues>();
    const { mode: formMode } = useFormMode();
    const isReadOnly = formMode === 'view';

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: 'supplierSkus',
    });

    return (
      <FormSection title={tEntity('sections.supplierSkus')}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{ border: '1px solid #eee', padding: 12, marginBottom: 12, borderRadius: 4 }}
          >
            <EntityLookupField
              name={`supplierSkus.${index}.supplierAccount` as const}
              control={form.control}
              servicePath={ServicePath.Account.Search}
              label="Tedarikçi"
            />
            <TextField
              name={`supplierSkus.${index}.sku` as const}
              control={form.control}
              label="SKU"
              required
              maxLength={25}
            />
            {!isReadOnly && (
              <Button htmlType="button" onClick={() => remove(index)}>
                Sil
              </Button>
            )}
          </div>
        ))}
        {!isReadOnly && (
          <Button
            htmlType="button"
            onClick={() => append({ supplierAccount: null, sku: '' })}
          >
            + SKU Ekle
          </Button>
        )}
      </FormSection>
    );
  }
}
