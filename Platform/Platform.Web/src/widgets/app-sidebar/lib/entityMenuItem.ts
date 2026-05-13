import { createElement } from 'react';
import type { TFunction } from 'i18next';
import type { EntityTypeMeta } from '../../../shared/lib/entity-type/types';
import type { MenuItem } from '../model/types';

export interface EntityMenuItemOverrides {
  /** MenuItem.key; verilmezse `meta.key.toLowerCase()` kullanılır. */
  key?: string;
  /**
   * Menü etiketi; verilmezse `t(meta.labelPlural ?? meta.label)` çağrılır.
   * Menu label'ları çoğu zaman entity label'larından farklıdır (örn.
   * "Aday Müşteriler" vs entity label "Aday"), override yaygın.
   */
  label?: string;
  /** List sayfasının path'i (zorunlu). */
  to: string;
  /** Opsiyonel privilege koruması. */
  privilege?: string;
}

/**
 * `EntityTypeMeta`'dan `MenuItem` üretir. İkon registry'den otomatik gelir;
 * label/path menü-spesifik kalır.
 *
 *  const getMeta = useEntityTypeRegistry().get;
 *  entityMenuItem(getMeta('Account')!, t, { label: t('accounts'), to: RoutePaths.AccountsList })
 */
export function entityMenuItem(
  meta: EntityTypeMeta,
  t: TFunction,
  overrides: EntityMenuItemOverrides,
): MenuItem {
  return {
    key: overrides.key ?? meta.key.toLowerCase(),
    label: overrides.label ?? t(meta.labelPlural ?? meta.label),
    icon: createElement(meta.icon),
    to: overrides.to,
    privilege: overrides.privilege,
  };
}
