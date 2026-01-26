import type { RouteObject } from 'react-router-dom';
import { leadRoutes } from '@/routes/lead.routes';
import { activityRoutes } from '@/routes/activity.routes';
import historyRoutes from './history.routes';

// Tüm modül route'larını birleştir
export const appRoutes: RouteObject[] = [
  ...activityRoutes,
  ...leadRoutes,
  ...historyRoutes,
];

// Re-export individual routes for selective usage
// export { activityRoutes };
// export { leadRoutes };

// Type export for external usage
// export type { RouteObject };

export default appRoutes;
