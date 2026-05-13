import { useEffect, useState, type ReactNode } from 'react';
import { Button, Input } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  MoreOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  Controller,
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import { FormModeProvider } from '../form/FormModeContext';

export interface FilterPanelSearchField<TFilter extends FieldValues> {
  /** Form alanı adı — `TFilter`'ın string-tipinde bir key'i olmalı. */
  name: Path<TFilter>;
  /** Header'daki input için placeholder. Default: common:actions.search */
  placeholder?: string;
}

export interface FilterPanelProps<TFilter extends FieldValues> {
  /** URL'den (veya parent state'ten) gelen mevcut filtre değerleri. */
  values: TFilter;
  /** "Temizle" basıldığında ve initial mount'ta kullanılacak temel değerler. */
  defaultValues: DefaultValues<TFilter>;
  /** Opsiyonel zod schema — varsa RHF resolver olarak bağlanır. */
  schema?: ZodType<TFilter>;
  onApply: SubmitHandler<TFilter>;
  onClear: () => void;
  /** Header'a yerleşen, sürekli görünür search input. Verilmezse header yalnız buton barı. */
  searchField?: FilterPanelSearchField<TFilter>;
  /** Başlangıçta diğer filtreler açık mı? Default false. */
  defaultExpanded?: boolean;
  /**
   * Grid kolon sayısı (maks). Responsive — küçük ekranlarda otomatik 1-2 kolon.
   * Default 4.
   */
  columns?: 1 | 2 | 3 | 4;
  /** Body'deki diğer filtre alanları. RHF FormProvider altında çalışır. */
  children: ReactNode;
}

/**
 * Liste sayfaları için filtre paneli.
 *
 * Header her zaman görünür: opsiyonel search input + ikon-only Apply / Clear / Expand butonları.
 * Expand basıldığında diğer filtreler grid'de açılır.
 *
 * - İçeride RHF `useForm` + `FormProvider` kurar — header search ve body field'lar aynı form'u paylaşır.
 * - `FormModeProvider mode='edit'` ile sarmalanır → mode-aware field'lar her zaman input.
 * - `values` prop'u değişince form `reset` ile senkron olur (URL'den geri yükleme).
 * - Apply ikonu / Enter tuşu `handleSubmit(onApply)`'i tetikler.
 * - Clear ikonu `defaultValues`'a döner + `onClear`'ı çağırır.
 */
export function FilterPanel<TFilter extends FieldValues>({
  values,
  defaultValues,
  schema,
  onApply,
  onClear,
  searchField,
  defaultExpanded = false,
  columns = 4,
  children,
}: FilterPanelProps<TFilter>) {
  const { t } = useTranslation('common');
  const [collapsed, setCollapsed] = useState(!defaultExpanded);

  const form = useForm<TFilter>({
    defaultValues,
    values,
    resolver: schema ? (zodResolver(schema) as unknown as Resolver<TFilter>) : undefined,
  });

  // URL veya parent state dışsal olarak değişince form'u senkronla (örn. geri/ileri tuşu).
  useEffect(() => {
    form.reset(values);
    // values bir nesne — JSON.stringify ile sığ-eşit kıyaslama yeterli (filtreler primitif).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  const handleClear = () => {
    form.reset(defaultValues as TFilter);
    onClear();
  };

  return (
    <section
      style={{
        background: '#ffffff',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
      }}
    >
      <FormProvider {...form}>
        <FormModeProvider mode="edit">
          <form onSubmit={form.handleSubmit(onApply)}>
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 16px',
                borderBottom: collapsed ? 'none' : '1px solid #f0f0f0',
                background: '#ffffff',
              }}
            >
              {searchField ? (
                <Controller
                  control={form.control}
                  name={searchField.name}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={(field.value as string | undefined) ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder={searchField.placeholder ?? t('actions.search')}
                      prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                      allowClear
                      style={{ flex: 1 }}
                    />
                  )}
                />
              ) : (
                <div style={{ flex: 1 }} />
              )}

              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined />}
                aria-label={t('actions.apply')}
                title={t('actions.apply')}
              />
              <Button
                htmlType="button"
                icon={<CloseOutlined />}
                onClick={handleClear}
                aria-label={t('actions.clear')}
                title={t('actions.clear')}
              />
              <Button
                htmlType="button"
                icon={collapsed ? <MoreOutlined /> : <UpOutlined />}
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? t('filters.expand') : t('filters.collapse')}
                aria-expanded={!collapsed}
                title={collapsed ? t('filters.expand') : t('filters.collapse')}
              />
            </header>

            {!collapsed && (
              <div style={{ padding: '16px 16px 0', background: '#ffffff' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`,
                    maxWidth: columns * 320,
                    columnGap: 16,
                    rowGap: 0,
                    paddingBottom: 16,
                  }}
                >
                  {children}
                </div>
              </div>
            )}
          </form>
        </FormModeProvider>
      </FormProvider>
    </section>
  );
}
