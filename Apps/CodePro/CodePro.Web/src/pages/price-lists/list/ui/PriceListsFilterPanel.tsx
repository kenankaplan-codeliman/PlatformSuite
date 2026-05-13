import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField } from '@platform/ui';
import type { PriceListListFilter } from '../../../../entities/price-list/model/types';
import {
  priceListListFilterDefaults,
  priceListListFilterSchema,
} from '../../../../entities/price-list/model/listFilterSchema';

export interface PriceListsFilterPanelProps {
  values: PriceListListFilter;
  onApply: (next: PriceListListFilter) => void;
  onClear: () => void;
}

export function PriceListsFilterPanel({
  values,
  onApply,
  onClear,
}: PriceListsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.price-lists-list');

  return (
    <FilterPanel<PriceListListFilter>
      values={values}
      defaultValues={priceListListFilterDefaults}
      schema={priceListListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <PriceListFilterFields />
    </FilterPanel>
  );
}

function PriceListFilterFields() {
  const { t: tEntity } = useTranslation('entity.price-list');
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext<PriceListListFilter>();

  return (
    <SelectField<PriceListListFilter, boolean>
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
