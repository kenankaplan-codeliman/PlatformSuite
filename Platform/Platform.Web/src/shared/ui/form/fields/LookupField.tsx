import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Select, Spin } from "antd";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { FormMode } from "../../../types/FormMode";
import { useFormMode } from "../useFormMode";
import { useErrorMessage } from "../../../lib/i18n/errorMessage";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import type { FormRowItemProps } from "../FormRow";

export interface LookupOption {
  id: string;
  label: string;
  description?: string | null;
}

export interface LookupSearchResult {
  items: LookupOption[];
  hasMoreRecord: boolean;
}

export type LookupSearchFn = (
  searchText: string,
  pageNumber: number,
  pageSize: number,
) => Promise<LookupSearchResult>;

export interface LookupFieldProps<TValues extends FieldValues> extends FormRowItemProps {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  searchFn: LookupSearchFn;

  label?: string;
  placeholder?: string;
  required?: boolean;
  allowClear?: boolean;

  /** Form değeri bir id (string). Mevcut seçim için label parent tarafından sağlanır. */
  initialLabel?: string | null;

  pageSize?: number;
  debounceMs?: number;

  /** Client_Architecture §8 — mode override hiyerarşisi. */
  force?: "readonly" | "editable";
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

/**
 * Mode-aware lookup primitifi — Client_Architecture §8.
 * En düşük seviye generic primitif: `searchFn` dışarıdan enjekte edilir.
 * EntityReference sözleşmesine uyan endpoint'ler için üst katman
 * `EntityLookupField` kullanılır; yalnızca özel response shape'leri
 * veya client-side filter gerekiyorsa bu primitif doğrudan tüketilir.
 *
 * Davranış:
 * - Form değeri sadece **id** (string). Görüntüleme label'ı dahili cache + `initialLabel`.
 * - Debounce'lu async arama.
 * - "Daha fazla yükle" — popup kaydırma dibinde sonraki sayfa çekilir.
 * - View modda: salt metin (mevcut label).
 */
export function LookupField<TValues extends FieldValues>({
  name,
  control,
  searchFn,
  label,
  placeholder,
  required,
  allowClear = true,
  initialLabel,
  pageSize = 10,
  debounceMs = 300,
  force,
  hideInMode,
  requiredInMode,
}: LookupFieldProps<TValues>) {
  const { mode } = useFormMode();
  const translateError = useErrorMessage();
  const { t } = useTranslation("common");

  const [searchText, setSearchText] = useState("");
  const debouncedText = useDebouncedValue(searchText, debounceMs);

  const [options, setOptions] = useState<LookupOption[]>([]);
  const [labelCache, setLabelCache] = useState<Record<string, string>>({});
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreRecord, setHasMoreRecord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Async arama — debouncedText değiştikçe ilk sayfa çekilir
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const result = await searchFn(debouncedText, 1, pageSize);
        if (cancelled) return;
        setOptions(result.items);
        setHasMoreRecord(result.hasMoreRecord);
        setPageNumber(1);
        setLabelCache((prev) => {
          const next = { ...prev };
          for (const item of result.items) next[item.id] = item.label;
          return next;
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedText, pageSize, searchFn]);

  const handlePopupScroll = useCallback(
    async (event: React.UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      if (!isAtBottom || !hasMoreRecord || isLoading) return;

      setIsLoading(true);
      try {
        const nextPage = pageNumber + 1;
        const result = await searchFn(debouncedText, nextPage, pageSize);
        setOptions((prev) => [...prev, ...result.items]);
        setHasMoreRecord(result.hasMoreRecord);
        setPageNumber(nextPage);
        setLabelCache((prev) => {
          const next = { ...prev };
          for (const item of result.items) next[item.id] = item.label;
          return next;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedText, hasMoreRecord, isLoading, pageNumber, pageSize, searchFn],
  );

  // antd Select için options (description görünür)
  const selectOptions = useMemo(
    () =>
      options.map((o) => ({
        value: o.id,
        label: (
          <div>
            <div>{o.label}</div>
            {o.description && (
              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                {o.description}
              </div>
            )}
          </div>
        ),
      })),
    [options],
  );

  if (hideInMode?.includes(mode)) return null;

  const isViewMode =
    force === "readonly" || (force !== "editable" && mode === "view");
  const effectiveRequired = required || requiredInMode?.includes(mode);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentId =
          (field.value as string | null | undefined) ?? undefined;
        const displayLabel = currentId
          ? (labelCache[currentId] ?? initialLabel ?? currentId)
          : undefined;

        return (
          <Form.Item
            label={label}
            required={effectiveRequired && !isViewMode}
            validateStatus={fieldState.error ? "error" : undefined}
            help={translateError(fieldState.error?.message)}
          >
            {isViewMode ? (
              <span>{displayLabel ?? "—"}</span>
            ) : (
              <Select
                showSearch
                filterOption={false}
                allowClear={allowClear}
                placeholder={placeholder ?? t("actions.search")}
                value={currentId}
                onChange={(next) => field.onChange(next ?? null)}
                onBlur={field.onBlur}
                onSearch={setSearchText}
                onPopupScroll={handlePopupScroll}
                notFoundContent={isLoading ? <Spin size="small" /> : null}
                options={selectOptions}
                // Seçili değer options listede yoksa label'ı labelCache üzerinden gösterebilmek için:
                labelRender={(selected) =>
                  labelCache[selected.value as string] ??
                  (selected.label as React.ReactNode)
                }
              />
            )}
          </Form.Item>
        );
      }}
    />
  );
}
