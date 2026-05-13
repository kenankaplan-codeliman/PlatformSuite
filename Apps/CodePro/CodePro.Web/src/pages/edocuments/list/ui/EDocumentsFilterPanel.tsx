import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  TextField,
  enumToOptions,
  useEnumTranslation,
} from '@platform/ui';
import type { EDocumentListFilter } from '../../../../entities/edocument/model/types';
import {
  EDOCUMENT_STATUSES,
  eDocumentListFilterDefaults,
  eDocumentListFilterSchema,
} from '../../../../entities/edocument/model/listFilterSchema';

export interface EDocumentsFilterPanelProps {
  values: EDocumentListFilter;
  onApply: (next: EDocumentListFilter) => void;
  onClear: () => void;
}

export function EDocumentsFilterPanel({
  values,
  onApply,
  onClear,
}: EDocumentsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.edocuments-list');

  return (
    <FilterPanel<EDocumentListFilter>
      values={values}
      defaultValues={eDocumentListFilterDefaults}
      schema={eDocumentListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'search',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <EDocumentFilterFields />
    </FilterPanel>
  );
}

function EDocumentFilterFields() {
  const { t: tEntity } = useTranslation('entity.edocument');
  const { t: tCommon } = useTranslation('common');
  const tStatus = useEnumTranslation('eDocumentStatus');
  const { control } = useFormContext<EDocumentListFilter>();

  return (
    <>
      <TextField
        name="documentType"
        control={control}
        label={tEntity('fields.documentType.label')}
      />
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={enumToOptions(EDOCUMENT_STATUSES, tStatus)}
        allowClear
      />
      <TextField
        name="entityType"
        control={control}
        label={tEntity('fields.entityType.label')}
      />
      <SelectField<EDocumentListFilter, boolean>
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
