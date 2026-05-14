import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FilterPanel,
  SelectField,
  TextField,
  useGeneralParameters,
} from '@platform/ui';
import type { ContactListFilter } from '../../../../entities/contact/model/types';
import {
  contactListFilterDefaults,
  contactListFilterSchema,
} from '../../../../entities/contact/model/listFilterSchema';

export interface ContactsFilterPanelProps {
  values: ContactListFilter;
  onApply: (next: ContactListFilter) => void;
  onClear: () => void;
}

export function ContactsFilterPanel({ values, onApply, onClear }: ContactsFilterPanelProps) {
  const { t: tPage } = useTranslation('page.contacts-list');

  return (
    <FilterPanel<ContactListFilter>
      values={values}
      defaultValues={contactListFilterDefaults}
      schema={contactListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'contactName',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <ContactFilterFields />
    </FilterPanel>
  );
}

function ContactFilterFields() {
  const { t: tEntity } = useTranslation('entity.contact');
  const { t: tCommon } = useTranslation('common');
  const { options: statusOptions } = useGeneralParameters('ContactStatus');
  const { control } = useFormContext<ContactListFilter>();

  return (
    <>
      <SelectField
        name="contactStatus"
        control={control}
        label={tEntity('fields.contactStatus.label')}
        options={statusOptions}
        allowClear
      />
      <TextField
        name="title"
        control={control}
        label={tEntity('fields.title.label')}
      />
      <TextField
        name="department"
        control={control}
        label={tEntity('fields.department.label')}
      />
      <SelectField<ContactListFilter, boolean>
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
