import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RoutePaths } from '@/constants/route.paths';

// Lazy load Lead pages for code splitting
//const LeadList = lazy(() => import('@/pages/lead/LeadList'));
//const LeadDetail = lazy(() => import('@/pages/lead/LeadDetail'));

import LeadList from '@/pages/lead/LeadList';
import LeadDetail from '@/pages/lead/LeadDetail';
// Lead routes configuration
export const leadRoutes: RouteObject[] = [
  {
    path: RoutePaths.Lead.List,
    element: <LeadList />,
  },
  {
    path: RoutePaths.Lead.New,
    element: <LeadDetail />,
  },
  {
    path: RoutePaths.Lead.View(':id'),
    element: <LeadDetail />,
  },
  {
    path: RoutePaths.Lead.Edit(':id'),
    element: <LeadDetail />,
  },
];

export default leadRoutes;
