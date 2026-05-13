import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { SupplierListFilter } from '../../../../entities/supplier/model/types';
import {
  COMPANY_TYPES,
  SUPPLIER_STATUSES,
  SUPPLIER_TYPES,
  supplierListFilterDefaults,
  supplierListFilterSchema,
} from '../../../../entities/supplier/model/listFilterSchema';

export interface SuppliersFilterPanelProps {
  values: SupplierListFilter;
  onApply: (next: SupplierListFilter) => void;
  onClear: () => void;
}

export function SuppliersFilterPanel({ values, onApply, onClear }: SuppliersFilterPanelProps) {
  const { t: tPage } = useTranslation('page.suppliers-list');

  return (
    <FilterPanel<SupplierListFilter>
      values={values}
      defaultValues={supplierListFilterDefaults}
      schema={supplierListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <SupplierFilterFields />
    </FilterPanel>
  );
}

/** FormProvider altında çalışır — `useFormContext` ile RHF control alır. */
function SupplierFilterFields() {
  const { t: tEntity } = useTranslation('entity.supplier');
  const { t: tCommon } = useTranslation('common');
  const tType = useEnumTranslation('supplierType');
  const tStatus = useEnumTranslation('supplierStatus');
  const tCompany = useEnumTranslation('companyType');
  const { control } = useFormContext<SupplierListFilter>();

  return (
    <>
      <SelectField
        name="supplierType"
        control={control}
        label={tEntity('fields.supplierType.label')}
        options={enumToOptions(SUPPLIER_TYPES, tType)}
        allowClear
      />
      <SelectField
        name="supplierStatus"
        control={control}
        label={tEntity('fields.supplierStatus.label')}
        options={enumToOptions(SUPPLIER_STATUSES, tStatus)}
        allowClear
      />
      <SelectField
        name="companyType"
        control={control}
        label={tEntity('fields.companyType.label')}
        options={enumToOptions(COMPANY_TYPES, tCompany)}
        allowClear
      />
      <SelectField<SupplierListFilter, boolean>
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
