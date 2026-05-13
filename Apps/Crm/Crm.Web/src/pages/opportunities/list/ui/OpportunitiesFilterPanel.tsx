import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { OpportunityListFilter } from '../../../../entities/opportunity/model/types';
import {
  OPPORTUNITY_STAGES,
  opportunityListFilterDefaults,
  opportunityListFilterSchema,
} from '../../../../entities/opportunity/model/listFilterSchema';

export interface OpportunitiesFilterPanelProps {
  values: OpportunityListFilter;
  onApply: (next: OpportunityListFilter) => void;
  onClear: () => void;
}

export function OpportunitiesFilterPanel({
  values,
  onApply,
  onClear,
}: OpportunitiesFilterPanelProps) {
  const { t: tPage } = useTranslation('page.opportunities-list');

  return (
    <FilterPanel<OpportunityListFilter>
      values={values}
      defaultValues={opportunityListFilterDefaults}
      schema={opportunityListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <OpportunityFilterFields />
    </FilterPanel>
  );
}

function OpportunityFilterFields() {
  const { t: tEntity } = useTranslation('entity.opportunity');
  const { t: tCommon } = useTranslation('common');
  const tStage = useEnumTranslation('opportunityStage');
  const { control } = useFormContext<OpportunityListFilter>();

  return (
    <>
      <SelectField
        name="stage"
        control={control}
        label={tEntity('fields.stage.label')}
        options={enumToOptions(OPPORTUNITY_STAGES, tStage)}
        allowClear
      />
      <SelectField<OpportunityListFilter, boolean>
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
