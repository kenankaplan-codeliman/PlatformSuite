import type { ComponentType } from 'react';

/**
 * Widget kataloğu girdisi — saf metadata. App'ler kendi widget'larını bu sözleşmeyle bildirir.
 * 12 sütunluk grid varsayılır (span 1-12).
 */
export interface DashboardWidgetMeta {
  key: string;
  /** App i18n'ında başlık anahtarı; getWidgetTitle ile çözülür. */
  titleKey: string;
  /** 12 sütunluk grid'de kapladığı genişlik. */
  span: number;
  /** Activity tabanlı widget'larda owner-scope switch'i. */
  hasOwnerScope?: boolean;
}

/** Tüm widget bileşenlerinin aldığı ortak props. Owner-scope'u olmayan widget'lar yok sayar. */
export interface DashboardWidgetProps {
  ownerOnly: boolean;
  onOwnerOnlyChange: (ownerOnly: boolean) => void;
}

/** Katalog key'i → widget bileşeni eşlemesi (app sağlar). */
export type DashboardComponentMap = Record<string, ComponentType<DashboardWidgetProps>>;
