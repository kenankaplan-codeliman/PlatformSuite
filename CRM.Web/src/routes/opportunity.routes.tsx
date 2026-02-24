import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';

const OpportunityList = lazy(() => import('@/pages/opportunity/OpportunityList'));
const OpportunityDetail = lazy(() => import('@/pages/opportunity/OpportunityDetail'));

export const opportunityRoutes: RouteObject[] = [
  {
    path: RoutePaths.Opportunity.List,
    element: <OpportunityList />,
  },
  {
    path: RoutePaths.Opportunity.New,
    element: <OpportunityDetail />,
  },
  {
    path: RoutePaths.Opportunity.Detail(':id'),
    element: <OpportunityDetail />,
  },
  
];

export default opportunityRoutes;
