import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';

// Lazy load Account pages for code splitting
const AccountList = lazy(() => import('@/pages/account/AccountList'));
const AccountDetail = lazy(() => import('@/pages/account/AccountDetail'));

// Account routes configuration
export const accountRoutes: RouteObject[] = [
  {
    path: RoutePaths.Account.List,
    element: <AccountList />,
  },
  {
    path: RoutePaths.Account.New,
    element: <AccountDetail />,
  },
  {
    path: RoutePaths.Account.Detail(':id'),
    element: <AccountDetail />,
  },
  
];

export default accountRoutes;
