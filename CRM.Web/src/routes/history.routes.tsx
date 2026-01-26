import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

// Lazy load Activity pages for code splitting
const History = lazy(() => import('@/pages/History'));

// History routes configuration
export const historyRoutes: RouteObject[] = [
  // Main history list (supports both list and calendar views via query param)
  {
    path: "/history",
    element: <History />,
  },
  ];

export default historyRoutes;
