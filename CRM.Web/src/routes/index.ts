import type { RouteObject } from 'react-router-dom';
import { leadRoutes } from '@/routes/lead.routes';
import { activityRoutes } from '@/routes/activity.routes';
import { accountRoutes } from '@/routes/account.routes';

// Tüm modül route'larını birleştir
export const appRoutes: RouteObject[] = [
  ...activityRoutes,
  ...leadRoutes,
  ...accountRoutes,
];

export default appRoutes;
