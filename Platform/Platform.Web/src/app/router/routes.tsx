import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../pages/auth/login/ui/LoginPage';
import { HomePage } from '../../pages/home/ui/HomePage';
import { ActivitiesListPage } from '../../pages/activities/list/ui/ActivitiesListPage';
import { ActivityDetailPage } from '../../pages/activities/detail/ui/ActivityDetailPage';
import { OrganizationsListPage } from '../../pages/organizations/list/ui/OrganizationsListPage';
import { OrganizationDetailPage } from '../../pages/organizations/detail/ui/OrganizationDetailPage';
import { AppUsersListPage } from '../../pages/users/list/ui/AppUsersListPage';
import { AppUserDetailPage } from '../../pages/users/detail/ui/AppUserDetailPage';
import { AppRolesListPage } from '../../pages/app-roles/list/ui/AppRolesListPage';
import { AppRoleDetailPage } from '../../pages/app-roles/detail/ui/AppRoleDetailPage';
import { AuthGuard } from './guards/AuthGuard';
import { RoutePaths, RoutePatterns } from './paths';

const protectedRoute = (element: React.ReactNode) => <AuthGuard>{element}</AuthGuard>;

export const router = createBrowserRouter([
  { path: RoutePaths.Login, element: <LoginPage /> },

  { path: RoutePaths.Home, element: protectedRoute(<HomePage />) },

  { path: RoutePatterns.ActivitiesList, element: protectedRoute(<ActivitiesListPage />) },
  { path: RoutePatterns.ActivityNew, element: protectedRoute(<ActivityDetailPage />) },
  { path: RoutePatterns.ActivityEdit, element: protectedRoute(<ActivityDetailPage />) },
  { path: RoutePatterns.ActivityView, element: protectedRoute(<ActivityDetailPage />) },

  { path: RoutePatterns.OrganizationsList, element: protectedRoute(<OrganizationsListPage />) },
  { path: RoutePatterns.OrganizationNew, element: protectedRoute(<OrganizationDetailPage />) },
  { path: RoutePatterns.OrganizationEdit, element: protectedRoute(<OrganizationDetailPage />) },
  { path: RoutePatterns.OrganizationView, element: protectedRoute(<OrganizationDetailPage />) },

  { path: RoutePatterns.AppUsersList, element: protectedRoute(<AppUsersListPage />) },
  { path: RoutePatterns.AppUserNew, element: protectedRoute(<AppUserDetailPage />) },
  { path: RoutePatterns.AppUserEdit, element: protectedRoute(<AppUserDetailPage />) },
  { path: RoutePatterns.AppUserView, element: protectedRoute(<AppUserDetailPage />) },

  { path: RoutePatterns.AppRolesList, element: protectedRoute(<AppRolesListPage />) },
  { path: RoutePatterns.AppRoleNew, element: protectedRoute(<AppRoleDetailPage />) },
  { path: RoutePatterns.AppRoleEdit, element: protectedRoute(<AppRoleDetailPage />) },
  { path: RoutePatterns.AppRoleView, element: protectedRoute(<AppRoleDetailPage />) },
]);
