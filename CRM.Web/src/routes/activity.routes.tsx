import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RoutePaths } from '@/constants/route.paths';


const ActivityList = lazy(() => import('@/pages/activity/ActivityList'));
const EmailDetail = lazy(() => import('@/pages/activity/EmailDetail'));
const PhoneCallDetail = lazy(() => import('@/pages/activity/PhoneCallDetail'));
const TaskDetail = lazy(() => import('@/pages/activity/TaskDetail'));
const AppointmentDetail = lazy(() => import('@/pages/activity/AppointmentDetail'));

// Activity routes configuration
export const activityRoutes: RouteObject[] = [
  // Main activity list
  {
    path: RoutePaths.Activity.List,
    element: <ActivityList />,
  },

  // Email routes
  {
    path: RoutePaths.Activity.Email.New,
    element: <EmailDetail />,
  },
  {
    path: RoutePaths.Activity.Email.Detail(':id'),
    element: <EmailDetail />,
  },

  // Phone Call routes
  {
    path: RoutePaths.Activity.PhoneCall.New,
    element: <PhoneCallDetail />,
  },
  {
    path: RoutePaths.Activity.PhoneCall.Detail(':id'),
    element: <PhoneCallDetail />,
  },

  // Task routes
  {
    path: RoutePaths.Activity.Task.New,
    element: <TaskDetail />,
  },
  {
    path: RoutePaths.Activity.Task.Detail(':id'),
    element: <TaskDetail />,
  },

  // Appointment routes
  {
    path: RoutePaths.Activity.Appointment.New,
    element: <AppointmentDetail />,
  },
  {
    path: RoutePaths.Activity.Appointment.Detail(':id'),
    element: <AppointmentDetail />,
  },
];

export default activityRoutes;
