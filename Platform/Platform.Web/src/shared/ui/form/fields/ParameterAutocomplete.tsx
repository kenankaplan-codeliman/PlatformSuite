import { AutoComplete, Form } from 'antd';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';
import type { FormRowItemProps } from '../FormRow';
import { useGeneralParameters } from '../../../hooks/useGeneralParameters';

/**
 * GeneralParameter-beslemeli, serbest metin destekli autocomplete alanı.
 *
 * İki form alanı yazar: <c>nameName</c> (görünen ad) ve <c>codeName</c> (parametre kodu).
 * - Listeden bir seçenek seçilirse hem ad hem kod dolar.
 * - Serbest metin yazılırsa yalnız ad dolar, kod boşalır (null).
 *
 * Bağımlılık (ülke→şehir→ilçe) için <c>parentCode</c> reaktiftir; üst alan değişince
 * kompoze eden bileşen (ör. AddressField) yeni parentCode'u geçer ve <c>onValueChange</c>
 * ile alt alanları sıfırlar. Bileşenin kendisi "aptal"dır; cascade orkestrasyonu dışarıdadır.
 */
export interface ParameterAutocompleteProps<TValues extends FieldValues>
  extends FormRowItemProps {
  control: Control<TValues>;
  nameName: FieldPath<TValues>;
  codeName: FieldPath<TValues>;
  /** Seçeneklerin yükleneceği GeneralParameter parentCode'u. Boşsa yalnız serbest metin. */
  parentCode?: string | null;
  lang?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  /** Kullanıcı değeri değiştirince (seçim veya serbest yazım) çağrılır — cascade reset için. */
  onValueChange?: () => void;
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

interface AcOption {
  value: string;
  code: string;
}

export function ParameterAutocomplete<TValues extends FieldValues>({
  control,
  nameName,
  codeName,
  parentCode,
  lang,
  label,
  placeholder,
  required,
  onValueChange,
  force,
  hideInMode,
  requiredInMode,
}: ParameterAutocompleteProps<TValues>) {
  const { mode } = useFormMode();
  const translateError = useErrorMessage();
  const { options } = useGeneralParameters(parentCode, lang);

  const nameCtl = useController({ name: nameName, control });
  const codeCtl = useController({ name: codeName, control });

  if (hideInMode?.includes(mode)) return null;

  const isViewMode = force === 'readonly' || (force !== 'editable' && mode === 'view');
  const effectiveRequired = required || requiredInMode?.includes(mode);

  const acOptions: AcOption[] = options.map((o) => ({ value: o.label, code: o.value }));
  const nameValue = (nameCtl.field.value as string | null | undefined) ?? undefined;

  // Yazılan metne göre client-side filtre (antd filterOption deprecated).
  const filtered =
    nameValue && nameValue.length > 0
      ? acOptions.filter((o) => o.value.toLowerCase().includes(nameValue.toLowerCase()))
      : acOptions;

  return (
    <Form.Item
      label={label}
      required={effectiveRequired && !isViewMode}
      validateStatus={nameCtl.fieldState.error ? 'error' : undefined}
      help={translateError(nameCtl.fieldState.error?.message)}
    >
      {isViewMode ? (
        <span>{nameValue ?? '—'}</span>
      ) : (
        <AutoComplete<string, AcOption>
          value={nameValue}
          options={filtered}
          placeholder={placeholder}
          allowClear
          style={{ width: '100%' }}
          onSelect={(value, option) => {
            // Listeden seçildi → ad + kod birlikte.
            nameCtl.field.onChange(value);
            codeCtl.field.onChange(option.code);
            onValueChange?.();
          }}
          onChange={(value) => {
            // Serbest metin / temizleme → ad set, kod boşalır. (Seçimde onSelect ezer.)
            nameCtl.field.onChange(value ?? '');
            codeCtl.field.onChange(null);
            onValueChange?.();
          }}
          onBlur={nameCtl.field.onBlur}
        />
      )}
    </Form.Item>
  );
}
