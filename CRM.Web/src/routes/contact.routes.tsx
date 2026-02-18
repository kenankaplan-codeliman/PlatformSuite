import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';

// Lazy load Account pages for code splitting
const ContactList = lazy(() => import('@/pages/contact/ContactList'));
const ContactDetail = lazy(() => import('@/pages/contact/ContactDetail'));

// Account routes configuration
export const contactRoutes: RouteObject[] = [
  {
    path: RoutePaths.Contact.List,
    element: <ContactList />,
  },
  {
    path: RoutePaths.Contact.New,
    element: <ContactDetail />,
  },
  {
    path: RoutePaths.Contact.Detail(':id'),
    element: <ContactDetail />,
  },
  
];

export default contactRoutes;
