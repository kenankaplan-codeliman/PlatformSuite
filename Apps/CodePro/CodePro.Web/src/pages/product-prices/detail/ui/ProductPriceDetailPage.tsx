import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  DetailPageLayout,
  EntityLookupField,
  FormSection,
  NumberField,
  ServicePath,
  TextField,
  useRouteMode,
} from '@platform/ui';
import { CodeProServicePath } from '../../../../shared/api/servicePaths';
import { useProductPriceQuery } from '../../../../entities/product-price/api/useProductPriceQueries';
import {
  useDeleteProductPrice,
  useUpsertProductPrice,
} from '../../../../entities/product-price/api/useProductPriceMutations';
import { productPriceSchema } from '../../../../entities/product-price/model/schema';
import type { ProductPriceFormValues } from '../../../../entities/product-price/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyProductPrice: ProductPriceFormValues = {
  id: '',
  product: null,
  supplierAccount: null,
  priceList: null,
  minimumQuantity: 1,
  validFrom: new Date().toISOString(),
  validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  unitPrice: 0,
  currency: 'TRY',
  isActive: true,
};

export function ProductPriceDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.product-prices-detail');
  const { t: tEntity } = useTranslation('entity.product-price');

  const query = useProductPriceQuery(id);
  const upsert = useUpsertProductPrice();
  const deleteMutation = useDeleteProductPrice();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.product?.name ?? tPage('viewTitle');
  }, [mode, query.data?.product?.name, tPage]);

  return (
    <DetailPageLayout<ProductPriceFormValues>
      mode={mode}
      title={title}
      schema={productPriceSchema}
      defaultValues={emptyProductPrice}
      data={query.data as ProductPriceFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.ProductPriceView(saved.id)}
    >
      <GeneralSection />
    </DetailPageLayout>
  );

  function GeneralSection() {
    const form = useFormContext<ProductPriceFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <EntityLookupField<ProductPriceFormValues>
          name="product"
          control={form.control}
          servicePath={CodeProServicePath.Product.Search}
          label={tEntity('fields.product.label')}
          placeholder={tEntity('fields.product.placeholder')}
        />
        <EntityLookupField<ProductPriceFormValues>
          name="supplierAccount"
          control={form.control}
          servicePath={ServicePath.Account.Search}
          label={tEntity('fields.supplier.label')}
          placeholder={tEntity('fields.supplier.placeholder')}
        />
        <EntityLookupField<ProductPriceFormValues>
          name="priceList"
          control={form.control}
          servicePath={CodeProServicePath.PriceList.Search}
          label={tEntity('fields.priceList.label')}
          placeholder={tEntity('fields.priceList.placeholder')}
          allowClear
        />
        <NumberField
          name="minimumQuantity"
          control={form.control}
          label={tEntity('fields.minimumQuantity.label')}
          min={0}
        />
        <NumberField
          name="unitPrice"
          control={form.control}
          label={tEntity('fields.unitPrice.label')}
          required
          min={0}
        />
        <TextField
          name="currency"
          control={form.control}
          label={tEntity('fields.currency.label')}
          required
          maxLength={10}
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
}
