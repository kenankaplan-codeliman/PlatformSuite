import {
  type ArrayPath,
  type Control,
  type FieldValues,
} from 'react-hook-form';
import {
  CheckboxField,
  newId,
  SelectField,
  TableField,
  TextField,
  type SelectOption,
  type TableFieldColumn,
} from '@platform/ui';

/**
 * CRM ortak telefon editörü — Account/Contact gibi telefon tutan entity'lerde
 * kullanılır. Dış API'si (`{ control, name }`) korunur; içeride generic
 * `TableField` primitive'i column template'i ile sarılır.
 */

interface PhoneRow {
  id: string;
  phoneNumber: string;
  type: string;
  isPrimary: boolean;
}

// Telefon türü küçük ve sabit bir enum — GeneralParameter'a taşınmadı.
const phoneTypeOptions: SelectOption<string>[] = [
  { value: 'Mobile', label: 'Cep' },
  { value: 'Work', label: 'İş' },
  { value: 'Home', label: 'Ev' },
  { value: 'Fax', label: 'Faks' },
  { value: 'Other', label: 'Diğer' },
];

const newPhone = (): PhoneRow => ({
  id: newId(),
  phoneNumber: '',
  type: 'Mobile',
  isPrimary: false,
});

export interface PhoneFieldProps<TValues extends FieldValues> {
  control: Control<TValues>;
  /** Telefon dizisi form alanı (ör. "phones"). */
  name: ArrayPath<TValues>;
}

export function PhoneField<TValues extends FieldValues>({
  control,
  name,
}: PhoneFieldProps<TValues>) {
  const columns: TableFieldColumn<TValues, PhoneRow>[] = [
    {
      key: 'phoneNumber',
      header: 'Telefon',
      width: '1fr',
      render: ({ path }) => (
        <TextField
          name={path('phoneNumber')}
          control={control}
          required
          maxLength={50}
        />
      ),
    },
    {
      key: 'type',
      header: 'Tür',
      width: '160px',
      render: ({ path }) => (
        <SelectField
          name={path('type')}
          control={control}
          options={phoneTypeOptions}
        />
      ),
    },
    {
      key: 'isPrimary',
      header: 'Birincil',
      width: '90px',
      align: 'center',
      render: ({ path }) => (
        <CheckboxField name={path('isPrimary')} control={control} />
      ),
    },
  ];

  return (
    <TableField<TValues, PhoneRow>
      control={control}
      name={name}
      columns={columns}
      newRow={newPhone}
      addLabel="Telefon Ekle"
      emptyLabel="Telefon bulunmuyor."
    />
  );
}
