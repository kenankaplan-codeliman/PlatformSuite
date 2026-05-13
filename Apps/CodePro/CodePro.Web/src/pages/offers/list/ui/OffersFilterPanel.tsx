import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { OfferListFilter } from '../../../../entities/offer/model/types';
import {
  OFFER_STATUSES,
  OFFER_TYPES,
  offerListFilterDefaults,
  offerListFilterSchema,
} from '../../../../entities/offer/model/listFilterSchema';

export interface OffersFilterPanelProps {
  values: OfferListFilter;
  onApply: (next: OfferListFilter) => void;
  onClear: () => void;
}

export function OffersFilterPanel({ values, onApply, onClear }: OffersFilterPanelProps) {
  const { t: tPage } = useTranslation('page.offers-list');

  return (
    <FilterPanel<OfferListFilter>
      values={values}
      defaultValues={offerListFilterDefaults}
      schema={offerListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <OfferFilterFields />
    </FilterPanel>
  );
}

function OfferFilterFields() {
  const { t: tEntity } = useTranslation('entity.offer');
  const { t: tCommon } = useTranslation('common');
  const tType = useEnumTranslation('offerType');
  const tStatus = useEnumTranslation('offerStatus');
  const { control } = useFormContext<OfferListFilter>();

  return (
    <>
      <SelectField
        name="offerType"
        control={control}
        label={tEntity('fields.offerType.label')}
        options={enumToOptions(OFFER_TYPES, tType)}
        allowClear
      />
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={enumToOptions(OFFER_STATUSES, tStatus)}
        allowClear
      />
      <SelectField<OfferListFilter, boolean>
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
