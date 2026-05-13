import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { PurchaseBasketListFilter } from '../../../../entities/purchase-basket/model/types';
import {
  PURCHASE_BASKET_STATUSES,
  purchaseBasketListFilterDefaults,
  purchaseBasketListFilterSchema,
} from '../../../../entities/purchase-basket/model/listFilterSchema';

export interface PurchaseBasketsFilterPanelProps {
  values: PurchaseBasketListFilter;
  onApply: (next: PurchaseBasketListFilter) => void;
  onClear: () => void;
}

export function PurchaseBasketsFilterPanel({
  values,
  onApply,
  onClear,
}: PurchaseBasketsFilterPanelProps) {
  return (
    <FilterPanel<PurchaseBasketListFilter>
      values={values}
      defaultValues={purchaseBasketListFilterDefaults}
      schema={purchaseBasketListFilterSchema}
      onApply={onApply}
      onClear={onClear}
    >
      <PurchaseBasketFilterFields />
    </FilterPanel>
  );
}

function PurchaseBasketFilterFields() {
  const { t: tEntity } = useTranslation('entity.purchase-basket');
  const { t: tCommon } = useTranslation('common');
  const tStatus = useEnumTranslation('purchaseBasketStatus');
  const { control } = useFormContext<PurchaseBasketListFilter>();

  return (
    <>
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={enumToOptions(PURCHASE_BASKET_STATUSES, tStatus)}
        allowClear
      />
      <SelectField<PurchaseBasketListFilter, boolean>
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
