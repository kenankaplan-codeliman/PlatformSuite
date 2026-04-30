import { create } from 'zustand';

/**
 * Global UI state — sidebar, tema, toast queue gibi cross-page durumlar.
 * İlk dalga için minimal; ileride genişletilir.
 */
interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
