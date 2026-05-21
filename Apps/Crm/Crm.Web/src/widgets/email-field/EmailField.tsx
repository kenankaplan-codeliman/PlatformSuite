import {
  useFieldArray,
  type ArrayPath,
  type Control,
  type FieldArray,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  CheckboxField,
  EmptyState,
  FormRow,
  SelectField,
  Space,
  TextField,
  useFormMode,
  type SelectOption,
} from "@platform/ui";

/**
 * CRM ortak e-posta editörü — Account/Contact gibi e-posta tutan entity'lerde kullanılır.
 *
 * Form-state'e bağlıdır (react-hook-form field array); entity command'ı ile aynı transaction'da
 * kaydedilir (AYRI servis yoktur). Yeni satırlara client UUID atanır; backend eşleşmeyen id'yi
 * yeni kayıt olarak ekler. Autocomplete YOK — düz alanlar.
 */

// E-posta türü küçük ve sabit bir enum — GeneralParameter'a taşınmadı.
const emailTypeOptions: SelectOption<string>[] = [
  { value: "Work", label: "İş" },
  { value: "Personal", label: "Kişisel" },
  { value: "Billing", label: "Fatura" },
  { value: "Support", label: "Destek" },
  { value: "Other", label: "Diğer" },
];

const newEmail = () => ({
  id: crypto.randomUUID(),
  email: "",
  type: "Work",
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
  const { mode } = useFormMode();
  const isView = mode === "view";
  const { fields, append, remove } = useFieldArray<TValues>({ control, name });

  const path = (index: number, sub: string) =>
    `${name}.${index}.${sub}` as FieldPath<TValues>;

  return (
    <div style={{ marginBottom: 12 }}>
      <Space direction="vertical" style={{ width: "100%" }} size={12}>
        {fields.map((f, index) => (
          <Card key={f.id} size="small" className="comm-card">
            <FormRow columns={2}>
              <TextField
                name={path(index, "email")}
                control={control}
                label="E-posta"
                required
                maxLength={250}
                columns={1}
              />
              <SelectField
                name={path(index, "type")}
                control={control}
                label="Tür"
                options={emailTypeOptions}
                columns={1}
              />
            </FormRow>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <CheckboxField
                name={path(index, "isPrimary")}
                control={control}
                text="Birincil e-posta"
              />
              {!isView && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => remove(index)}
                  aria-label="E-postayı sil"
                />
              )}
            </div>
          </Card>
        ))}
      </Space>

      {fields.length === 0 && isView && (
        <EmptyState description="E-posta bulunmuyor." />
      )}

      {!isView && (
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={() =>
            append(newEmail() as unknown as FieldArray<TValues, ArrayPath<TValues>>)
          }
          style={{ marginTop: 12, marginBottom: 16 }}
        >
          E-posta Ekle
        </Button>
      )}
    </div>
  );
}
