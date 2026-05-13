import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { PurchaseRequestListFilter } from '../../../../entities/purchase-request/model/types';
import {
  PURCHASE_REQUEST_PRIORITIES,
  PURCHASE_REQUEST_STATUSES,
  purchaseRequestListFilterDefaults,
  purchaseRequestListFilterSchema,
} from '../../../../entities/purchase-request/model/listFilterSchema';

export interface PurchaseRequestsFilterPanelProps {
  values: PurchaseRequestListFilter;
  onApply: (next: PurchaseRequestListFilter) => void;
  onClear: () => void;
}

export function PurchaseRequestsFilterPanel({
  values,
  onApply,
  onClear,
}: PurchaseRequestsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.purchase-requests-list');

  return (
    <FilterPanel<PurchaseRequestListFilter>
      values={values}
      defaultValues={purchaseRequestListFilterDefaults}
      schema={purchaseRequestListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <PurchaseRequestFilterFields />
    </FilterPanel>
  );
}

function PurchaseRequestFilterFields() {
  const { t: tEntity } = useTranslation('entity.purchase-request');
  const { t: tCommon } = useTranslation('common');
  const tStatus = useEnumTranslation('purchaseRequestStatus');
  const tPriority = useEnumTranslation('purchaseRequestPriority');
  const { control } = useFormContext<PurchaseRequestListFilter>();

  return (
    <>
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={enumToOptions(PURCHASE_REQUEST_STATUSES, tStatus)}
        allowClear
      />
      <SelectField
        name="priority"
        control={control}
        label={tEntity('fields.priority.label')}
        options={enumToOptions(PURCHASE_REQUEST_PRIORITIES, tPriority)}
        allowClear
      />
      <SelectField<PurchaseRequestListFilter, boolean>
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
