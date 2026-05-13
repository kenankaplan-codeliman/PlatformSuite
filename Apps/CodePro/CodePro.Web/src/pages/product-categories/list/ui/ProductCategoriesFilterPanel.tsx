import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField } from '@platform/ui';
import type { ProductCategoryListFilter } from '../../../../entities/product-category/model/types';
import {
  productCategoryListFilterDefaults,
  productCategoryListFilterSchema,
} from '../../../../entities/product-category/model/listFilterSchema';

export interface ProductCategoriesFilterPanelProps {
  values: ProductCategoryListFilter;
  onApply: (next: ProductCategoryListFilter) => void;
  onClear: () => void;
}

export function ProductCategoriesFilterPanel({
  values,
  onApply,
  onClear,
}: ProductCategoriesFilterPanelProps) {
  const { t: tPage } = useTranslation('page.product-categories-list');

  return (
    <FilterPanel<ProductCategoryListFilter>
      values={values}
      defaultValues={productCategoryListFilterDefaults}
      schema={productCategoryListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <ProductCategoryFilterFields />
    </FilterPanel>
  );
}

function ProductCategoryFilterFields() {
  const { t: tEntity } = useTranslation('entity.product-category');
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext<ProductCategoryListFilter>();

  return (
    <SelectField<ProductCategoryListFilter, boolean>
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
