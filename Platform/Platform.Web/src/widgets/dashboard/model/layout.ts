import type { DashboardWidgetMeta } from './contracts';

export interface WidgetLayoutEntry {
  key: string;
  visible: boolean;
}

/** Kullanıcının dashboard layout'u — widget sırası/görünürlüğü + owner-scope durumları. */
export interface DashboardLayout {
  widgets: WidgetLayoutEntry[];
  ownerScopes: Record<string, boolean>;
}

/** Katalog sırasına göre tüm widget'lar görünür, owner-scope'lar kapalı. */
export function defaultLayout(catalog: readonly DashboardWidgetMeta[]): DashboardLayout {
  return {
    widgets: catalog.map((w) => ({ key: w.key, visible: true })),
    ownerScopes: Object.fromEntries(
      catalog.filter((w) => w.hasOwnerScope).map((w) => [w.key, false]),
    ),
  };
}

/**
 * Kaydedilmiş layout'u katalogla bağdaştırır: bilinmeyen key'leri atar, kataloğa sonradan
 * eklenen widget'ları sona görünür ekler, owner-scope varsayılanlarını korur.
 */
export function reconcile(
  saved: Partial<DashboardLayout> | null | undefined,
  catalog: readonly DashboardWidgetMeta[],
): DashboardLayout {
  const base = defaultLayout(catalog);
  if (!saved?.widgets?.length) return base;

  const known = new Set(catalog.map((w) => w.key));
  const savedKnown = saved.widgets.filter((w) => known.has(w.key));
  const savedKeys = new Set(savedKnown.map((w) => w.key));
  const appended = catalog
    .filter((w) => !savedKeys.has(w.key))
    .map((w) => ({ key: w.key, visible: true }));

  return {
    widgets: [
      ...savedKnown.map((w) => ({ key: w.key, visible: w.visible !== false })),
      ...appended,
    ],
    ownerScopes: { ...base.ownerScopes, ...(saved.ownerScopes ?? {}) },
  };
}

export function serializeLayout(layout: DashboardLayout): string {
  return JSON.stringify(layout);
}

export function parseLayout(
  json: string | null | undefined,
  catalog: readonly DashboardWidgetMeta[],
): DashboardLayout | null {
  if (!json) return null;
  try {
    return reconcile(JSON.parse(json) as Partial<DashboardLayout>, catalog);
  } catch {
    return null;
  }
}
