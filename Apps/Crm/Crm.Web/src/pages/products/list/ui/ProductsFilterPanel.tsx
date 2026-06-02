import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField, TextField, useGeneralParameters } from '@platform/ui';
import type { ProductListFilter } from '../../../../entities/product/model/types';
import {
  productListFilterDefaults,
  productListFilterSchema,
} from '../../../../entities/product/model/listFilterSchema';

export interface ProductsFilterPanelProps {
  values: ProductListFilter;
  onApply: (next: ProductListFilter) => void;
  onClear: () => void;
}

export function ProductsFilterPanel({
  values,
  onApply,
  onClear,
}: ProductsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.products-list');

  return (
    <FilterPanel<ProductListFilter>
      values={values}
      defaultValues={productListFilterDefaults}
      schema={productListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'name',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <ProductFilterFields />
    </FilterPanel>
  );
}

function ProductFilterFields() {
  const { t: tEntity } = useTranslation('entity.product');
  const { t: tCommon } = useTranslation('common');
  const { options: categoryOptions } = useGeneralParameters('ProductCategory');
  const { control } = useFormContext<ProductListFilter>();

  return (
    <>
      <TextField
        name="productCode"
        control={control}
        label={tEntity('fields.productCode.label')}
      />
      <SelectField
        name="category"
        control={control}
        label={tEntity('fields.category.label')}
        options={categoryOptions}
        allowClear
      />
      <SelectField<ProductListFilter, boolean>
        name="isActive"
        control={control}
        label={tEntity('fields.isActive.label')}
        options={[
          { value: true, label: tCommon('filters.activeOnly') },
          { value: false, label: tCommon('filters.inactiveOnly') },
        ]}
        allowClear
      />
    </>
  );
}
