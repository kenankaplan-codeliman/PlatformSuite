import type { CSSProperties } from "react";
import { Form } from "antd";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import ReactQuill, { Quill } from "react-quill-new";
import DOMPurify from "dompurify";
import "react-quill-new/dist/quill.snow.css";
import type { FormMode } from "../../../types/FormMode";
import { useFormMode } from "../useFormMode";
import { useErrorMessage } from "../../../lib/i18n/errorMessage";
import type { FormRowItemProps } from "../FormRow";

// Quill'in varsayılan boyut formatı sınıf-tabanlı ve yalnız small/large/huge
// destekler. Sayısal (px) boyutlar için style-tabanlı 'size' attributor'ını
// px whitelist ile kaydet (modül import'unda tek sefer çalışır).
const SIZE_WHITELIST = [
  "6px",
  "9px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "48px",
  "72px",
];
const SizeStyle = Quill.import("attributors/style/size") as {
  whitelist: string[] | null;
};
SizeStyle.whitelist = SIZE_WHITELIST;
Quill.register(SizeStyle as never, true);

const TOOLBAR = [
  [{ font: [] }, { size: SIZE_WHITELIST }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "blockquote"],
];

// modules SABİT referans olmalı: her render'da yeni nesne verilirse react-quill-new
// editörü yeniden kurar; seçim kaybolur ve seçime bağlı butonlar (örn. 'clean')
// çalışmaz. Bu yüzden modül seviyesinde tek bir nesne tutuyoruz.
const MODULES = { toolbar: TOOLBAR };

// Quill 'snow' temasının sabit kenarlık (#ccc) ve siyah ikon renklerini antd
// component'lerimizle aynı tona çek: kenarlık antd border grisi (#d9d9d9) + 6px
// radius, ikonlar nötr gri. Hover/focus/active renk efekti yok. Yükseklik alan
// başına --rte-min-height ile ayarlanır. React 19 <style href precedence> ile
// tek sefer head'e enjekte eder (birden çok editör örneğinde tekrarlanmaz).
const RTE_STYLES = `
.rich-text-editor .ql-editor { min-height: var(--rte-min-height, 200px); }
.rich-text-editor .ql-toolbar.ql-snow,
.rich-text-editor .ql-container.ql-snow { border-color: #d9d9d9; }
.rich-text-editor .ql-toolbar.ql-snow { border-top-left-radius: 6px; border-top-right-radius: 6px; }
.rich-text-editor .ql-container.ql-snow { border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }
.rich-text-editor .ql-snow .ql-stroke { stroke: rgba(0, 0, 0, 0.45); }
.rich-text-editor .ql-snow .ql-fill { fill: rgba(0, 0, 0, 0.45); }
.rich-text-editor .ql-snow .ql-picker { color: rgba(0, 0, 0, 0.45); }
.rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-label[data-value]::before,
.rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-item[data-value]::before { content: attr(data-value); }
.rich-text-editor .ql-snow .ql-picker.ql-size .ql-picker-options { max-height: 240px; overflow-y: auto; }
`;

export interface RichTextEditorProps<
  TValues extends FieldValues,
> extends FormRowItemProps {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  minHeight?: number;
  force?: "readonly" | "editable";
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

export function RichTextEditor<TValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  minHeight = 200,
  force,
  hideInMode,
  requiredInMode,
}: RichTextEditorProps<TValues>) {
  const { mode } = useFormMode();
  const translateError = useErrorMessage();

  if (hideInMode?.includes(mode)) return null;

  const isViewMode =
    force === "readonly" || (force !== "editable" && mode === "view");
  const effectiveRequired = required || requiredInMode?.includes(mode);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          required={effectiveRequired && !isViewMode}
          validateStatus={fieldState.error ? "error" : undefined}
          help={translateError(fieldState.error?.message)}
          style={{ marginBottom: 16 }}
        >
          {isViewMode ? (
            field.value ? (
              <div
                className="ql-editor"
                style={{ padding: 0 }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(field.value),
                }}
              />
            ) : (
              <span>—</span>
            )
          ) : (
            <div
              className="rich-text-editor"
              style={{ "--rte-min-height": `${minHeight}px` } as CSSProperties}
            >
              <style href="rich-text-editor" precedence="default">
                {RTE_STYLES}
              </style>
              <ReactQuill
                theme="snow"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                modules={MODULES}
              />
            </div>
          )}
        </Form.Item>
      )}
    />
  );
}
