import type { DashboardLayout } from './layout';

/** Dashboard layout MVI intent'leri (UPPER_SNAKE_CASE discriminated union). */
export type DashboardLayoutIntent =
  | { type: 'HYDRATE'; layout: DashboardLayout }
  | { type: 'REORDER'; order: string[] }
  | { type: 'TOGGLE_VISIBILITY'; key: string }
  | { type: 'SET_OWNER_SCOPE'; key: string; ownerOnly: boolean };
