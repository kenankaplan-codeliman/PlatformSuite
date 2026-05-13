import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { BudgetListFilter } from '../../../../entities/budget/model/types';
import {
  BUDGET_PERIOD_TYPES,
  BUDGET_STATUSES,
  budgetListFilterDefaults,
  budgetListFilterSchema,
} from '../../../../entities/budget/model/listFilterSchema';

export interface BudgetsFilterPanelProps {
  values: BudgetListFilter;
  onApply: (next: BudgetListFilter) => void;
  onClear: () => void;
}

export function BudgetsFilterPanel({ values, onApply, onClear }: BudgetsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.budgets-list');

  return (
    <FilterPanel<BudgetListFilter>
      values={values}
      defaultValues={budgetListFilterDefaults}
      schema={budgetListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <BudgetFilterFields />
    </FilterPanel>
  );
}

function BudgetFilterFields() {
  const { t: tEntity } = useTranslation('entity.budget');
  const { t: tCommon } = useTranslation('common');
  const tStatus = useEnumTranslation('budgetStatus');
  const tPeriod = useEnumTranslation('budgetPeriodType');
  const { control } = useFormContext<BudgetListFilter>();

  return (
    <>
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={enumToOptions(BUDGET_STATUSES, tStatus)}
        allowClear
      />
      <SelectField
        name="periodType"
        control={control}
        label={tEntity('fields.periodType.label')}
        options={enumToOptions(BUDGET_PERIOD_TYPES, tPeriod)}
        allowClear
      />
      <SelectField<BudgetListFilter, boolean>
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
