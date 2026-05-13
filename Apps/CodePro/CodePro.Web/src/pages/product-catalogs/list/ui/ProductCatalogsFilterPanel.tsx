import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField } from '@platform/ui';
import type { ProductCatalogListFilter } from '../../../../entities/product-catalog/model/types';
import {
  productCatalogListFilterDefaults,
  productCatalogListFilterSchema,
} from '../../../../entities/product-catalog/model/listFilterSchema';

export interface ProductCatalogsFilterPanelProps {
  values: ProductCatalogListFilter;
  onApply: (next: ProductCatalogListFilter) => void;
  onClear: () => void;
}

export function ProductCatalogsFilterPanel({
  values,
  onApply,
  onClear,
}: ProductCatalogsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.product-catalogs-list');

  return (
    <FilterPanel<ProductCatalogListFilter>
      values={values}
      defaultValues={productCatalogListFilterDefaults}
      schema={productCatalogListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <ProductCatalogFilterFields />
    </FilterPanel>
  );
}

function ProductCatalogFilterFields() {
  const { t: tEntity } = useTranslation('entity.product-catalog');
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext<ProductCatalogListFilter>();

  return (
    <SelectField<ProductCatalogListFilter, boolean>
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
