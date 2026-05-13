import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField } from '@platform/ui';
import type { BrandListFilter } from '../../../../entities/brand/model/types';
import {
  brandListFilterDefaults,
  brandListFilterSchema,
} from '../../../../entities/brand/model/listFilterSchema';

export interface BrandsFilterPanelProps {
  values: BrandListFilter;
  onApply: (next: BrandListFilter) => void;
  onClear: () => void;
}

export function BrandsFilterPanel({ values, onApply, onClear }: BrandsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.brands-list');

  return (
    <FilterPanel<BrandListFilter>
      values={values}
      defaultValues={brandListFilterDefaults}
      schema={brandListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <BrandFilterFields />
    </FilterPanel>
  );
}

function BrandFilterFields() {
  const { t: tEntity } = useTranslation('entity.brand');
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext<BrandListFilter>();

  return (
    <SelectField<BrandListFilter, boolean>
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
