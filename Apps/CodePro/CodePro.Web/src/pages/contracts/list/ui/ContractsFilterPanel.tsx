import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { ContractListFilter } from '../../../../entities/contract/model/types';
import {
  CONTRACT_STATUSES,
  CONTRACT_TYPES,
  contractListFilterDefaults,
  contractListFilterSchema,
} from '../../../../entities/contract/model/listFilterSchema';

export interface ContractsFilterPanelProps {
  values: ContractListFilter;
  onApply: (next: ContractListFilter) => void;
  onClear: () => void;
}

export function ContractsFilterPanel({ values, onApply, onClear }: ContractsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.contracts-list');

  return (
    <FilterPanel<ContractListFilter>
      values={values}
      defaultValues={contractListFilterDefaults}
      schema={contractListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <ContractFilterFields />
    </FilterPanel>
  );
}

function ContractFilterFields() {
  const { t: tEntity } = useTranslation('entity.contract');
  const { t: tCommon } = useTranslation('common');
  const tType = useEnumTranslation('contractType');
  const tStatus = useEnumTranslation('contractStatus');
  const { control } = useFormContext<ContractListFilter>();

  return (
    <>
      <SelectField
        name="type"
        control={control}
        label={tEntity('fields.type.label')}
        options={enumToOptions(CONTRACT_TYPES, tType)}
        allowClear
      />
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={enumToOptions(CONTRACT_STATUSES, tStatus)}
        allowClear
      />
      <SelectField<ContractListFilter, boolean>
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
