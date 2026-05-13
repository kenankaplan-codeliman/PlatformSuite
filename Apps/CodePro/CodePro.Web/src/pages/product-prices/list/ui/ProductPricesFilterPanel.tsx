import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField } from '@platform/ui';
import type { ProductPriceListFilter } from '../../../../entities/product-price/model/types';
import {
  productPriceListFilterDefaults,
  productPriceListFilterSchema,
} from '../../../../entities/product-price/model/listFilterSchema';

export interface ProductPricesFilterPanelProps {
  values: ProductPriceListFilter;
  onApply: (next: ProductPriceListFilter) => void;
  onClear: () => void;
}

export function ProductPricesFilterPanel({
  values,
  onApply,
  onClear,
}: ProductPricesFilterPanelProps) {
  return (
    <FilterPanel<ProductPriceListFilter>
      values={values}
      defaultValues={productPriceListFilterDefaults}
      schema={productPriceListFilterSchema}
      onApply={onApply}
      onClear={onClear}
    >
      <ProductPriceFilterFields />
    </FilterPanel>
  );
}

function ProductPriceFilterFields() {
  const { t: tEntity } = useTranslation('entity.product-price');
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext<ProductPriceListFilter>();

  return (
    <SelectField<ProductPriceListFilter, boolean>
      name="isActive"
      control={control}
      label={tEntity('fields.isActive.label')}
      options={[
        { value: true, label: tCommon('filters.activeOnly') },
        { value: false, label: tCommon('filters.inactiveOnly') },
      ]}
      allowClear
    />
  );
}
