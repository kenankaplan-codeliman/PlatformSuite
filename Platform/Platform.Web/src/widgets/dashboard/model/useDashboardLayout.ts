import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  useUserPreference,
  useSaveUserPreference,
} from '../../../entities/user-preference/api/useUserPreferenceQueries';
import type { DashboardWidgetMeta } from './contracts';
import { dashboardLayoutReducer } from './reducer';
import { defaultLayout, parseLayout, serializeLayout } from './layout';

/**
 * Dashboard layout durumunu yönetir: MVI reducer + kişisel tercihin (generic user_preference)
 * hydrate'i + her kullanıcı değişikliğinde persist (mutation effect içinde — reducer saf).
 */
export function useDashboardLayout(catalog: readonly DashboardWidgetMeta[], preferenceKey: string) {
  const preferenceQuery = useUserPreference(preferenceKey);
  const saveMutation = useSaveUserPreference();

  const [layout, dispatch] = useReducer(dashboardLayoutReducer, undefined, () =>
    defaultLayout(catalog),
  );
  const hydratedRef = useRef(false);
  const skipPersistRef = useRef(false);

  // Tercih yüklenince bir kez hydrate; persist effect'inin bu yüklemeyi geri yazmaması için skip.
  useEffect(() => {
    if (!preferenceQuery.isSuccess || hydratedRef.current) return;
    hydratedRef.current = true;
    const saved = parseLayout(preferenceQuery.data.value, catalog);
    if (saved) {
      skipPersistRef.current = true;
      dispatch({ type: 'HYDRATE', layout: saved });
    }
  }, [preferenceQuery.isSuccess, preferenceQuery.data, catalog]);

  // Hydrate sonrası her kullanıcı değişikliğini kalıcı yap.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    saveMutation.mutate({ key: preferenceKey, value: serializeLayout(layout) });
    // saveMutation/preferenceKey stabil; yalnız layout değişiminde tetiklemek istiyoruz.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  const reorder = useCallback((order: string[]) => dispatch({ type: 'REORDER', order }), []);
  const toggleVisibility = useCallback(
    (key: string) => dispatch({ type: 'TOGGLE_VISIBILITY', key }),
    [],
  );
  const setOwnerScope = useCallback(
    (key: string, ownerOnly: boolean) => dispatch({ type: 'SET_OWNER_SCOPE', key, ownerOnly }),
    [],
  );
  const reset = useCallback(
    () => dispatch({ type: 'HYDRATE', layout: defaultLayout(catalog) }),
    [catalog],
  );

  const visibleKeys = useMemo(
    () => layout.widgets.filter((w) => w.visible).map((w) => w.key),
    [layout.widgets],
  );

  return {
    layout,
    visibleKeys,
    reorder,
    toggleVisibility,
    setOwnerScope,
    reset,
    isLoading: preferenceQuery.isLoading,
  };
}
