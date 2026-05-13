import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField } from '@platform/ui';
import type { ManufacturerListFilter } from '../../../../entities/manufacturer/model/types';
import {
  manufacturerListFilterDefaults,
  manufacturerListFilterSchema,
} from '../../../../entities/manufacturer/model/listFilterSchema';

export interface ManufacturersFilterPanelProps {
  values: ManufacturerListFilter;
  onApply: (next: ManufacturerListFilter) => void;
  onClear: () => void;
}

export function ManufacturersFilterPanel({
  values,
  onApply,
  onClear,
}: ManufacturersFilterPanelProps) {
  const { t: tPage } = useTranslation('page.manufacturers-list');

  return (
    <FilterPanel<ManufacturerListFilter>
      values={values}
      defaultValues={manufacturerListFilterDefaults}
      schema={manufacturerListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <ManufacturerFilterFields />
    </FilterPanel>
  );
}

function ManufacturerFilterFields() {
  const { t: tEntity } = useTranslation('entity.manufacturer');
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext<ManufacturerListFilter>();

  return (
    <SelectField<ManufacturerListFilter, boolean>
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
