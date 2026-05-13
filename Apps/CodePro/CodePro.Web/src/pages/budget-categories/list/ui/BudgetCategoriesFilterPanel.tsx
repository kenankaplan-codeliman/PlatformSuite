import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField } from '@platform/ui';
import type { BudgetCategoryListFilter } from '../../../../entities/budget-category/model/types';
import {
  budgetCategoryListFilterDefaults,
  budgetCategoryListFilterSchema,
} from '../../../../entities/budget-category/model/listFilterSchema';

export interface BudgetCategoriesFilterPanelProps {
  values: BudgetCategoryListFilter;
  onApply: (next: BudgetCategoryListFilter) => void;
  onClear: () => void;
}

export function BudgetCategoriesFilterPanel({
  values,
  onApply,
  onClear,
}: BudgetCategoriesFilterPanelProps) {
  const { t: tPage } = useTranslation('page.budget-categories-list');

  return (
    <FilterPanel<BudgetCategoryListFilter>
      values={values}
      defaultValues={budgetCategoryListFilterDefaults}
      schema={budgetCategoryListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <BudgetCategoryFilterFields />
    </FilterPanel>
  );
}

function BudgetCategoryFilterFields() {
  const { t: tEntity } = useTranslation('entity.budget-category');
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext<BudgetCategoryListFilter>();

  return (
    <SelectField<BudgetCategoryListFilter, boolean>
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
