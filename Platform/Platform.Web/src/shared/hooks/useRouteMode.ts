import { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import type { FormMode } from '../types/FormMode';

/**
 * Detail sayfası mode'unu URL'den türetir — Client_Architecture §6.
 *
 * Kural:
 * - `/<entity>/new`         → 'new'
 * - `/<entity>/:id/edit`    → 'edit'
 * - `/<entity>/:id`         → 'view'
 *
 * Mode **state'te tutulmaz**; URL tek gerçek kaynaktır.
 */
export function useRouteMode(): { mode: FormMode; id?: string } {
  const params = useParams<{ id?: string }>();
  const { pathname } = useLocation();

  return useMemo(() => {
    if (!params.id) return { mode: 'new' };
    if (pathname.endsWith('/edit')) return { mode: 'edit', id: params.id };
    return { mode: 'view', id: params.id };
  }, [params.id, pathname]);
}
