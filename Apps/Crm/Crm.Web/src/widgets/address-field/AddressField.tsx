import {
  useFieldArray,
  useFormContext,
  useWatch,
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
  ParameterAutocomplete,
  SelectField,
  Space,
  TextField,
  useFormMode,
  type SelectOption,
} from "@platform/ui";

/**
 * CRM ortak adres editörü — Account/Contact gibi adres tutan entity'lerde kullanılır.
 *
 * Form-state'e bağlıdır (react-hook-form field array); entity command'ı ile aynı transaction'da
 * kaydedilir (attachment gibi AYRI servis yoktur). Okuma sırasında DetailPageLayout form'u
 * fetch edilen veriyle reset eder; adresler defaultValues üzerinden gelir.
 *
 * Ülke/şehir/ilçe parametrik (ParameterAutocomplete + GeneralParameter); bağımlılık (cascade)
 * orkestrasyonu burada: üst değişince alt kod+ad sıfırlanır. Generic component "aptal" kalır.
 */
const COUNTRY_PARENT_CODE = "Country";

// Adres türü küçük ve sabit bir enum — GeneralParameter'a taşınmadı.
const addressTypeOptions: SelectOption<string>[] = [
  { value: "Office", label: "Ofis" },
  { value: "Billing", label: "Fatura" },
  { value: "Shipping", label: "Teslimat" },
  { value: "Other", label: "Diğer" },
];

const emptyAddress = {
  addressLine1: "",
  addressLine2: null,
  countryCode: null,
  countryName: null,
  cityCode: null,
  cityName: null,
  districtCode: null,
  districtName: null,
  state: null,
  postalCode: null,
  type: "Office",
  isPrimary: false,
};

export interface AddressFieldProps<TValues extends FieldValues> {
  control: Control<TValues>;
  /** Adres dizisi form alanı (ör. "addresses"). */
  name: ArrayPath<TValues>;
}

export function AddressField<TValues extends FieldValues>({
  control,
  name,
}: AddressFieldProps<TValues>) {
  const { mode } = useFormMode();
  const isView = mode === "view";
  const { fields, append, remove } = useFieldArray<TValues>({ control, name });

  return (
    <div style={{ marginBottom: 12 }}>
      <Space direction="vertical" style={{ width: "100%" }} size={12}>
        {fields.map((f, index) => (
          <AddressRow
            key={f.id}
            control={control}
            name={name}
            index={index}
            canRemove={!isView}
            onRemove={() => remove(index)}
          />
        ))}
      </Space>

      {fields.length === 0 && isView && (
        <EmptyState size="small" description="Adres bulunmuyor." />
      )}

      {!isView && (
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={() => append(emptyAddress as unknown as FieldArray<TValues, ArrayPath<TValues>>)}
          style={{ marginTop: 12, marginBottom: 16 }}
        >
          Adres Ekle
        </Button>
      )}
    </div>
  );
}

function AddressRow<TValues extends FieldValues>({
  control,
  name,
  index,
  canRemove,
  onRemove,
}: {
  control: Control<TValues>;
  name: ArrayPath<TValues>;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const { setValue } = useFormContext<TValues>();
  const path = (sub: string) => `${name}.${index}.${sub}` as FieldPath<TValues>;

  const countryCode = useWatch({ control, name: path("countryCode") }) as
    | string
    | null
    | undefined;
  const cityCode = useWatch({ control, name: path("cityCode") }) as
    | string
    | null
    | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clear = (sub: string) =>
    setValue(path(sub), null as any, { shouldDirty: true });

  const resetDistrict = () => {
    clear("districtCode");
    clear("districtName");
  };
  const resetCity = () => {
    clear("cityCode");
    clear("cityName");
    resetDistrict();
  };

  return (
    <Card size="small" className="comm-card">
      <TextField
        name={path("addressLine1")}
        control={control}
        label="Adres Satırı 1"
        required
        maxLength={250}
      />
      <TextField
        name={path("addressLine2")}
        control={control}
        label="Adres Satırı 2"
        maxLength={250}
      />

      <FormRow columns={3}>
        <ParameterAutocomplete
          control={control}
          nameName={path("countryName")}
          codeName={path("countryCode")}
          parentCode={COUNTRY_PARENT_CODE}
          label="Ülke"
          placeholder="Seçin veya yazın"
          onValueChange={resetCity}
        />
        <ParameterAutocomplete
          control={control}
          nameName={path("cityName")}
          codeName={path("cityCode")}
          parentCode={countryCode ?? null}
          label="Şehir"
          placeholder="Seçin veya yazın"
          onValueChange={resetDistrict}
        />
        <ParameterAutocomplete
          control={control}
          nameName={path("districtName")}
          codeName={path("districtCode")}
          parentCode={cityCode ?? null}
          label="İlçe"
          placeholder="Seçin veya yazın"
        />
      </FormRow>

      <FormRow columns={3}>
        <TextField name={path("state")} control={control} label="Eyalet/Bölge" maxLength={150} />
        <TextField name={path("postalCode")} control={control} label="Posta Kodu" maxLength={50} />
        <SelectField
          name={path("type")}
          control={control}
          label="Tür"
          options={addressTypeOptions}
        />
      </FormRow>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <CheckboxField name={path("isPrimary")} control={control} text="Birincil adres" />
        {canRemove && (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={onRemove}
            aria-label="Adresi sil"
          />
        )}
      </div>
    </Card>
  );
}
