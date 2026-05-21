import { useCallback, useMemo, useRef, type CSSProperties } from "react";
import { Form, message } from "antd";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import ReactQuill, { Quill } from "react-quill-new";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import "react-quill-new/dist/quill.snow.css";
import type { FormMode } from "../../../types/FormMode";
import { useFormMode } from "../useFormMode";
import { useErrorMessage } from "../../../lib/i18n/errorMessage";
import type { FormRowItemProps } from "../FormRow";

// Görseller `<img src="data:image/...;base64,...">` olarak içeriğe GÖMÜLÜR (URL/path
// referansı değil). Bu, içeriği kendi kendine yeterli kılar ama HTML string'i büyütür;
// payload'ı sınırlamak için tip + boyut doğrulama ve uzun kenar downscale uygulanır.
const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB ham dosya
const MAX_IMAGE_DIMENSION = 1600; // uzun kenar (px)

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

// Büyük görselleri canvas ile yeniden boyutlandırıp base64 şişmesini azaltır.
// GIF animasyonu yeniden kodlamada kaybolacağı için olduğu gibi bırakılır; çözülemeyen
// veya zaten sınır içindeki görseller orijinal data URL ile döner.
function downscaleDataUrl(dataUrl: string, type: string): Promise<string> {
  if (type === "image/gif") return Promise.resolve(dataUrl);
  return new Promise((resolve) => {
    const image = new Image();
    image.onerror = () => resolve(dataUrl);
    image.onload = () => {
      const longest = Math.max(image.width, image.height);
      const scale =
        longest > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / longest : 1;
      if (scale === 1) {
        resolve(dataUrl);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      // JPEG'i 0.8 kalitede sıkıştır; PNG/WebP'yi şeffaflığı korumak için PNG'ye yaz.
      const outType = type === "image/jpeg" ? "image/jpeg" : "image/png";
      resolve(canvas.toDataURL(outType, 0.8));
    };
    image.src = dataUrl;
  });
}

// `data:image/svg+xml`, <img> ile yüklendiğinde script çalıştırmaz; yine de defansif
// olarak inline SVG data URI'lerini görsel kaynağından düşür (modül import'unda tek sefer).
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (
    node.tagName === "IMG" &&
    /^data:image\/svg\+xml/i.test(node.getAttribute("src") ?? "")
  ) {
    node.removeAttribute("src");
  }
});

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
  ["link", "image", "blockquote"],
];

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
  const { t } = useTranslation("common");

  // Quill örneğine toolbar handler içinden erişmek için ref tut.
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ALLOWED_IMAGE_TYPES.join(",");
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        message.error(t("richText.image.invalidType"));
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        message.error(
          t("richText.image.tooLarge", {
            size: Math.round(MAX_IMAGE_BYTES / (1024 * 1024)),
          }),
        );
        return;
      }
      try {
        const original = await readFileAsDataUrl(file);
        const dataUrl = await downscaleDataUrl(original, file.type);
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", dataUrl, "user");
        quill.setSelection(range.index + 1, 0, "silent");
      } catch {
        message.error(t("richText.image.failed"));
      }
    };
    input.click();
  }, [t]);

  // modules SABİT referans olmalı: her render'da yeni nesne verilirse react-quill-new
  // editörü yeniden kurar (seçim kaybolur). `t` ve dolayısıyla imageHandler normal
  // render'larda stabildir (yalnız dil değişiminde değişir), bu yüzden churn olmaz.
  const modules = useMemo(
    () => ({
      toolbar: { container: TOOLBAR, handlers: { image: imageHandler } },
    }),
    [imageHandler],
  );

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
                ref={quillRef}
                theme="snow"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                modules={modules}
              />
            </div>
          )}
        </Form.Item>
      )}
    />
  );
}
