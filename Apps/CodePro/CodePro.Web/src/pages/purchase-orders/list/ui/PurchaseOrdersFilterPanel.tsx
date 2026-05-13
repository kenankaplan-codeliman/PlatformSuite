import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { PurchaseOrderListFilter } from '../../../../entities/purchase-order/model/types';
import {
  PURCHASE_ORDER_PRIORITIES,
  PURCHASE_ORDER_STATUSES,
  purchaseOrderListFilterDefaults,
  purchaseOrderListFilterSchema,
} from '../../../../entities/purchase-order/model/listFilterSchema';

export interface PurchaseOrdersFilterPanelProps {
  values: PurchaseOrderListFilter;
  onApply: (next: PurchaseOrderListFilter) => void;
  onClear: () => void;
}

export function PurchaseOrdersFilterPanel({
  values,
  onApply,
  onClear,
}: PurchaseOrdersFilterPanelProps) {
  const { t: tPage } = useTranslation('page.purchase-orders-list');

  return (
    <FilterPanel<PurchaseOrderListFilter>
      values={values}
      defaultValues={purchaseOrderListFilterDefaults}
      schema={purchaseOrderListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <PurchaseOrderFilterFields />
    </FilterPanel>
  );
}

function PurchaseOrderFilterFields() {
  const { t: tEntity } = useTranslation('entity.purchase-order');
  const { t: tCommon } = useTranslation('common');
  const tStatus = useEnumTranslation('purchaseOrderStatus');
  const tPriority = useEnumTranslation('purchaseOrderPriority');
  const { control } = useFormContext<PurchaseOrderListFilter>();

  return (
    <>
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={enumToOptions(PURCHASE_ORDER_STATUSES, tStatus)}
        allowClear
      />
      <SelectField
        name="priority"
        control={control}
        label={tEntity('fields.priority.label')}
        options={enumToOptions(PURCHASE_ORDER_PRIORITIES, tPriority)}
        allowClear
      />
      <SelectField<PurchaseOrderListFilter, boolean>
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
