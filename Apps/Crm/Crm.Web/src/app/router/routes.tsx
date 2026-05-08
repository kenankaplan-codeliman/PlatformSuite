import { createBrowserRouter } from 'react-router-dom';
import {
  AccountDetailPage,
  AccountsListPage,
  AppRoleDetailPage,
  AppRolesListPage,
  AppUserDetailPage,
  AppUsersListPage,
  ContactDetailPage,
  ContactsListPage,
  HomePage,
  LoginPage,
} from '@platform/ui';
import { LeadDetailPage } from '../../pages/leads/detail/ui/LeadDetailPage';
import { LeadsListPage } from '../../pages/leads/list/ui/LeadsListPage';
import { OpportunityDetailPage } from '../../pages/opportunities/detail/ui/OpportunityDetailPage';
import { OpportunitiesListPage } from '../../pages/opportunities/list/ui/OpportunitiesListPage';
import { ProtectedShell } from './ProtectedShell';
import { RoutePaths, RoutePatterns } from './paths';

export const router = createBrowserRouter([
  { path: RoutePaths.Login, element: <LoginPage /> },

  {
    element: <ProtectedShell />,
    children: [
      { path: RoutePaths.Home, element: <HomePage /> },

      { path: RoutePatterns.AccountsList, element: <AccountsListPage /> },
      { path: RoutePatterns.AccountNew, element: <AccountDetailPage /> },
      { path: RoutePatterns.AccountEdit, element: <AccountDetailPage /> },
      { path: RoutePatterns.AccountView, element: <AccountDetailPage /> },

      { path: RoutePatterns.ContactsList, element: <ContactsListPage /> },
      { path: RoutePatterns.ContactNew, element: <ContactDetailPage /> },
      { path: RoutePatterns.ContactEdit, element: <ContactDetailPage /> },
      { path: RoutePatterns.ContactView, element: <ContactDetailPage /> },

      { path: RoutePatterns.LeadsList, element: <LeadsListPage /> },
      { path: RoutePatterns.LeadNew, element: <LeadDetailPage /> },
      { path: RoutePatterns.LeadEdit, element: <LeadDetailPage /> },
      { path: RoutePatterns.LeadView, element: <LeadDetailPage /> },

      { path: RoutePatterns.OpportunitiesList, element: <OpportunitiesListPage /> },
      { path: RoutePatterns.OpportunityNew, element: <OpportunityDetailPage /> },
      { path: RoutePatterns.OpportunityEdit, element: <OpportunityDetailPage /> },
      { path: RoutePatterns.OpportunityView, element: <OpportunityDetailPage /> },

      { path: RoutePatterns.AppUsersList, element: <AppUsersListPage /> },
      { path: RoutePatterns.AppUserNew, element: <AppUserDetailPage /> },
      { path: RoutePatterns.AppUserEdit, element: <AppUserDetailPage /> },
      { path: RoutePatterns.AppUserView, element: <AppUserDetailPage /> },

      { path: RoutePatterns.AppRolesList, element: <AppRolesListPage /> },
      { path: RoutePatterns.AppRoleNew, element: <AppRoleDetailPage /> },
      { path: RoutePatterns.AppRoleEdit, element: <AppRoleDetailPage /> },
      { path: RoutePatterns.AppRoleView, element: <AppRoleDetailPage /> },
    ],
  },
]);
