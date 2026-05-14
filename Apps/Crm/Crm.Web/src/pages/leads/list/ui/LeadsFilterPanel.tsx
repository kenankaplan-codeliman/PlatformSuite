import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField, useGeneralParameters } from '@platform/ui';
import type { LeadListFilter } from '../../../../entities/lead/model/types';
import {
  leadListFilterDefaults,
  leadListFilterSchema,
} from '../../../../entities/lead/model/listFilterSchema';

export interface LeadsFilterPanelProps {
  values: LeadListFilter;
  onApply: (next: LeadListFilter) => void;
  onClear: () => void;
}

export function LeadsFilterPanel({ values, onApply, onClear }: LeadsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.leads-list');

  return (
    <FilterPanel<LeadListFilter>
      values={values}
      defaultValues={leadListFilterDefaults}
      schema={leadListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <LeadFilterFields />
    </FilterPanel>
  );
}

function LeadFilterFields() {
  const { t: tEntity } = useTranslation('entity.lead');
  const { t: tCommon } = useTranslation('common');
  const { options: statusOptions } = useGeneralParameters('LeadStatus');
  const { options: sourceOptions } = useGeneralParameters('LeadSource');
  const { control } = useFormContext<LeadListFilter>();

  return (
    <>
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={statusOptions}
        allowClear
      />
      <SelectField
        name="source"
        control={control}
        label={tEntity('fields.source.label')}
        options={sourceOptions}
        allowClear
      />
      <SelectField<LeadListFilter, boolean>
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
