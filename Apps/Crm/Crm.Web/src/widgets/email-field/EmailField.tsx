import {
  type ArrayPath,
  type Control,
  type FieldValues,
} from 'react-hook-form';
import {
  CheckboxField,
  SelectField,
  TableField,
  TextField,
  type SelectOption,
  type TableFieldColumn,
} from '@platform/ui';

/**
 * CRM ortak e-posta editörü — Account/Contact gibi e-posta tutan entity'lerde
 * kullanılır. Dış API'si (`{ control, name }`) korunur; içeride generic
 * `TableField` primitive'i column template'i ile sarılır.
 *
 * Form-state'e bağlıdır (react-hook-form field array); entity command'ı ile
 * aynı transaction'da kaydedilir. Yeni satırlara `crypto.randomUUID()` atanır;
 * backend `CollectionSync.Merge` eşleşmeyen id'leri yeni kayıt olarak ekler.
 */

interface EmailRow {
  id: string;
  email: string;
  type: string;
  isPrimary: boolean;
}

// E-posta türü küçük ve sabit bir enum — GeneralParameter'a taşınmadı.
const emailTypeOptions: SelectOption<string>[] = [
  { value: 'Work', label: 'İş' },
  { value: 'Personal', label: 'Kişisel' },
  { value: 'Billing', label: 'Fatura' },
  { value: 'Support', label: 'Destek' },
  { value: 'Other', label: 'Diğer' },
];

const newEmail = (): EmailRow => ({
  id: crypto.randomUUID(),
  email: '',
  type: 'Work',
  isPrimary: false,
});

export interface EmailFieldProps<TValues extends FieldValues> {
  control: Control<TValues>;
  /** E-posta dizisi form alanı (ör. "emails"). */
  name: ArrayPath<TValues>;
}

export function EmailField<TValues extends FieldValues>({
  control,
  name,
}: EmailFieldProps<TValues>) {
  const columns: TableFieldColumn<TValues, EmailRow>[] = [
    {
      key: 'email',
      header: 'E-posta',
      width: '1fr',
      render: ({ path }) => (
        <TextField
          name={path('email')}
          control={control}
          required
          maxLength={250}
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
          options={emailTypeOptions}
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
    <TableField<TValues, EmailRow>
      control={control}
      name={name}
      columns={columns}
      newRow={newEmail}
      addLabel="E-posta Ekle"
      emptyLabel="E-posta bulunmuyor."
    />
  );
}
