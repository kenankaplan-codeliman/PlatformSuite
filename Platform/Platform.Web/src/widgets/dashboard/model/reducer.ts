import type { DashboardLayoutIntent } from './intent';
import type { DashboardLayout } from './layout';

/**
 * Saf reducer — yan etki yok, katalog bağımsız. RESET ve hydrate hook'taki effect'te
 * defaultLayout(catalog) ile HYDRATE olarak dispatch edilir.
 */
export function dashboardLayoutReducer(
  state: DashboardLayout,
  intent: DashboardLayoutIntent,
): DashboardLayout {
  switch (intent.type) {
    case 'HYDRATE':
      return intent.layout;

    case 'TOGGLE_VISIBILITY':
      return {
        ...state,
        widgets: state.widgets.map((w) =>
          w.key === intent.key ? { ...w, visible: !w.visible } : w,
        ),
      };

    case 'SET_OWNER_SCOPE':
      return {
        ...state,
        ownerScopes: { ...state.ownerScopes, [intent.key]: intent.ownerOnly },
      };

    case 'REORDER': {
      // intent.order yalnız görünür widget'ların yeni sırasıdır; gizli widget'lar
      // yerlerinde kalır. Tam listeyi gezip görünür slot'ları yeni sırayla doldururuz.
      let i = 0;
      const widgets = state.widgets.map((w) => {
        if (!w.visible) return w;
        const key = intent.order[i++];
        return state.widgets.find((x) => x.key === key) ?? w;
      });
      return { ...state, widgets };
    }

    default:
      return state;
  }
}
