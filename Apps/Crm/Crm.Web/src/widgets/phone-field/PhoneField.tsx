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
 * CRM ortak telefon editörü — Account/Contact gibi telefon tutan entity'lerde kullanılır.
 *
 * Form-state'e bağlıdır (react-hook-form field array); entity command'ı ile aynı transaction'da
 * kaydedilir (AYRI servis yoktur). Yeni satırlara client UUID atanır; backend eşleşmeyen id'yi
 * yeni kayıt olarak ekler. Autocomplete YOK — düz alanlar.
 */

// Telefon türü küçük ve sabit bir enum — GeneralParameter'a taşınmadı.
const phoneTypeOptions: SelectOption<string>[] = [
  { value: "Mobile", label: "Cep" },
  { value: "Work", label: "İş" },
  { value: "Home", label: "Ev" },
  { value: "Fax", label: "Faks" },
  { value: "Other", label: "Diğer" },
];

const newPhone = () => ({
  id: crypto.randomUUID(),
  phoneNumber: "",
  type: "Mobile",
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
                name={path(index, "phoneNumber")}
                control={control}
                label="Telefon"
                required
                maxLength={50}
                columns={1}
              />
              <SelectField
                name={path(index, "type")}
                control={control}
                label="Tür"
                options={phoneTypeOptions}
                columns={1}
              />
            </FormRow>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <CheckboxField
                name={path(index, "isPrimary")}
                control={control}
                text="Birincil telefon"
              />
              {!isView && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => remove(index)}
                  aria-label="Telefonu sil"
                />
              )}
            </div>
          </Card>
        ))}
      </Space>

      {fields.length === 0 && isView && (
        <EmptyState description="Telefon bulunmuyor." />
      )}

      {!isView && (
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={() =>
            append(newPhone() as unknown as FieldArray<TValues, ArrayPath<TValues>>)
          }
          style={{ marginTop: 12, marginBottom: 16 }}
        >
          Telefon Ekle
        </Button>
      )}
    </div>
  );
}
