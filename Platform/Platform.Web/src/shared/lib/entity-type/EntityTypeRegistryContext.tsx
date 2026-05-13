import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { EntityTypeKey, EntityTypeMeta } from './types';

/**
 * Polimorfik entity türlerinin görsel + navigasyon metadata kayıt defteri.
 *
 * Backend `IEntityReferenceResolver` registry pattern'inin frontend karşılığı.
 * Her app (Crm.Web, CodePro.Web) `App.tsx`'inde kendi `entries` listesiyle
 * bu provider'ı sarar. Platform yalnız User'ı katar. CRM CodePro türlerini
 * görmez, CodePro CRM türlerini görmez — app-bazlı izolasyon.
 *
 * Tüketim:
 *  - `useEntityType(key)` — daima bir meta döner (kayıtsızsa fallback).
 *  - `useEntityTypeRegistry()` — `.get(key)` undefined dönebilir; menu/list
 *    composition için kayıt olup olmadığını öğrenmek isteyenler kullanır.
 */
export interface EntityTypeRegistryValue {
  entries: ReadonlyArray<EntityTypeMeta>;
  get: (key?: string | null) => EntityTypeMeta | undefined;
  filter: (predicate: (m: EntityTypeMeta) => boolean) => EntityTypeMeta[];
}

const emptyValue: EntityTypeRegistryValue = {
  entries: [],
  get: () => undefined,
  filter: () => [],
};

const EntityTypeRegistryContext = createContext<EntityTypeRegistryValue>(emptyValue);

export interface EntityTypeRegistryProviderProps {
  entries: ReadonlyArray<EntityTypeMeta>;
  children: ReactNode;
}

export function EntityTypeRegistryProvider({
  entries,
  children,
}: EntityTypeRegistryProviderProps) {
  const value = useMemo<EntityTypeRegistryValue>(() => {
    const map = new Map<string, EntityTypeMeta>();
    for (const e of entries) map.set(e.key.toLowerCase(), e);
    return {
      entries,
      get: (key) => (key ? map.get(key.toLowerCase()) : undefined),
      filter: (predicate) => entries.filter(predicate),
    };
  }, [entries]);

  return (
    <EntityTypeRegistryContext.Provider value={value}>
      {children}
    </EntityTypeRegistryContext.Provider>
  );
}

/**
 * Kayıtsız anahtar için varsayılan: gri ton + soru işareti ikonu. Backend'in
 * `ReferenceRepository`'nin "bilinmeyen tip" davranışıyla simetrik.
 */
function fallbackMeta(key: EntityTypeKey): EntityTypeMeta {
  return {
    key,
    label: key || 'unknown',
    icon: QuestionCircleOutlined,
    tone: 'default',
  };
}

export function useEntityType(key?: string | null): EntityTypeMeta {
  const registry = useContext(EntityTypeRegistryContext);
  return registry.get(key) ?? fallbackMeta(key ?? 'unknown');
}

export function useEntityTypeRegistry(): EntityTypeRegistryValue {
  return useContext(EntityTypeRegistryContext);
}
