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
  productId: '',
  supplierAccountId: '',
  priceListId: null,
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
    return query.data?.productName ?? tPage('viewTitle');
  }, [mode, query.data?.productName, tPage]);

  const productInitialLabel = query.data?.productName ?? undefined;
  const supplierInitialLabel = query.data?.supplierAccountName ?? undefined;
  const priceListInitialLabel = query.data?.priceListName ?? undefined;

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
      <GeneralSection
        productInitialLabel={productInitialLabel}
        supplierInitialLabel={supplierInitialLabel}
        priceListInitialLabel={priceListInitialLabel}
      />
    </DetailPageLayout>
  );

  function GeneralSection({
    productInitialLabel,
    supplierInitialLabel,
    priceListInitialLabel,
  }: {
    productInitialLabel?: string;
    supplierInitialLabel?: string;
    priceListInitialLabel?: string;
  }) {
    const form = useFormContext<ProductPriceFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <EntityLookupField<ProductPriceFormValues>
          name="productId"
          control={form.control}
          servicePath="/api/product/list"
          label={tEntity('fields.product.label')}
          placeholder={tEntity('fields.product.placeholder')}
          initialLabel={productInitialLabel}
        />
        <EntityLookupField<ProductPriceFormValues>
          name="supplierAccountId"
          control={form.control}
          servicePath={ServicePath.Account.Search}
          label={tEntity('fields.supplier.label')}
          placeholder={tEntity('fields.supplier.placeholder')}
          initialLabel={supplierInitialLabel}
        />
        <EntityLookupField<ProductPriceFormValues>
          name="priceListId"
          control={form.control}
          servicePath="/api/price-list/list"
          label={tEntity('fields.priceList.label')}
          placeholder={tEntity('fields.priceList.placeholder')}
          initialLabel={priceListInitialLabel}
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
