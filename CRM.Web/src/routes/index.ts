import type { RouteObject } from 'react-router-dom';
import { leadRoutes } from '@/routes/lead.routes';
import { activityRoutes } from '@/routes/activity.routes';
import { accountRoutes } from '@/routes/account.routes';
import { contactRoutes } from '@/routes/contact.routes';

// Tüm modül route'larını birleştir
export const appRoutes: RouteObject[] = [
  ...activityRoutes,
  ...leadRoutes,
  ...accountRoutes,
  ...contactRoutes,
];

export default appRoutes;
