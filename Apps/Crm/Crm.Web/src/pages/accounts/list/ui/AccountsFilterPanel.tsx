import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  TextField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { AccountListFilter } from '../../../../entities/account/model/types';
import {
  ACCOUNT_STATUSES,
  ACCOUNT_TYPES,
  accountListFilterDefaults,
  accountListFilterSchema,
} from '../../../../entities/account/model/listFilterSchema';

export interface AccountsFilterPanelProps {
  values: AccountListFilter;
  onApply: (next: AccountListFilter) => void;
  onClear: () => void;
}

export function AccountsFilterPanel({ values, onApply, onClear }: AccountsFilterPanelProps) {
  const { t: tEntity } = useTranslation('entity.account');

  return (
    <FilterPanel<AccountListFilter>
      values={values}
      defaultValues={accountListFilterDefaults}
      schema={accountListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'accountName',
        placeholder: tEntity('fields.accountName.placeholder'),
      }}
    >
      <AccountFilterFields />
    </FilterPanel>
  );
}

/** FormProvider altında çalışır — `useFormContext` ile RHF control alır. */
function AccountFilterFields() {
  const { t: tEntity } = useTranslation('entity.account');
  const { t: tCommon } = useTranslation('common');
  const tType = useEnumTranslation('accountType');
  const tStatus = useEnumTranslation('accountStatus');
  const { control } = useFormContext<AccountListFilter>();

  return (
    <>
      <SelectField
        name="accountType"
        control={control}
        label={tEntity('fields.accountType.label')}
        options={enumToOptions(ACCOUNT_TYPES, tType)}
        allowClear
      />
      <SelectField
        name="accountStatus"
        control={control}
        label={tEntity('fields.accountStatus.label')}
        options={enumToOptions(ACCOUNT_STATUSES, tStatus)}
        allowClear
      />
      <TextField
        name="industry"
        control={control}
        label={tEntity('fields.industry.label')}
      />
      <SelectField<AccountListFilter, boolean>
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
