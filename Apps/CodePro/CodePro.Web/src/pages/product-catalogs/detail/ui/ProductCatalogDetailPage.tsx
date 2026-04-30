import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentPanel,
  DetailPageLayout,
  FormSection,
  TextAreaField,
  TextField,
  useRouteMode,
} from '@platform/ui';
import { useProductCatalogQuery } from '../../../../entities/product-catalog/api/useProductCatalogQueries';
import {
  useDeleteProductCatalog,
  useUpsertProductCatalog,
} from '../../../../entities/product-catalog/api/useProductCatalogMutations';
import { productCatalogSchema } from '../../../../entities/product-catalog/model/schema';
import type {
  ProductCatalogDetailItem,
  ProductCatalogFormValues,
} from '../../../../entities/product-catalog/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyProductCatalog: ProductCatalogFormValues = {
  id: '',
  code: '',
  name: '',
  description: null,
  validFrom: new Date().toISOString(),
  validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  priceCode: null,
  isActive: true,
  productIds: [],
  organizationIds: [],
};

function mapDataToForm(data: ProductCatalogDetailItem | undefined): ProductCatalogFormValues | undefined {
  if (!data) return undefined;
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    description: data.description,
    validFrom: data.validFrom,
    validUntil: data.validUntil,
    priceCode: data.priceCode,
    isActive: data.isActive,
    productIds: data.products.map((p) => p.productId),
    organizationIds: data.organizations.map((o) => o.appOrganizationId),
  };
}

export function ProductCatalogDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.product-catalogs-detail');
  const { t: tEntity } = useTranslation('entity.product-catalog');

  const query = useProductCatalogQuery(id);
  const upsert = useUpsertProductCatalog();
  const deleteMutation = useDeleteProductCatalog();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  const formData = useMemo(() => mapDataToForm(query.data), [query.data]);

  return (
    <DetailPageLayout<ProductCatalogFormValues>
      mode={mode}
      title={title}
      schema={productCatalogSchema}
      defaultValues={emptyProductCatalog}
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
      afterSaveNavigation={(saved) => RoutePaths.ProductCatalogView(saved.id)}
    >
      <GeneralSection />
      <RelationsSummary data={query.data} />
      <AttachmentPanel entityType="ProductCatalog" entityId={id} />
    </DetailPageLayout>
  );

  function GeneralSection() {
    const form = useFormContext<ProductCatalogFormValues>();
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
          maxLength={100}
        />
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity('fields.description.label')}
          rows={3}
          maxLength={1000}
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
        <TextField
          name="priceCode"
          control={form.control}
          label={tEntity('fields.priceCode.label')}
          maxLength={50}
        />
      </FormSection>
    );
  }

  function RelationsSummary({ data }: { data: ProductCatalogDetailItem | undefined }) {
    if (!data) return null;
    return (
      <FormSection title={tEntity('sections.products')}>
        <ul>
          {data.products.map((p) => (
            <li key={p.productId}>
              {p.productCode} — {p.productName}
            </li>
          ))}
          {data.products.length === 0 && <li>—</li>}
        </ul>
        <h4>{tEntity('sections.organizations')}</h4>
        <ul>
          {data.organizations.map((o) => (
            <li key={o.appOrganizationId}>{o.organizationName}</li>
          ))}
          {data.organizations.length === 0 && <li>—</li>}
        </ul>
      </FormSection>
    );
  }
}
