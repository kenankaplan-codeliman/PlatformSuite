import { createBrowserRouter } from 'react-router-dom';
import {
  ActivitiesListPage,
  ActivityDetailPage,
  AppRoleDetailPage,
  AppRolesListPage,
  AppUserDetailPage,
  AppUsersListPage,
  HomePage,
  LoginPage,
} from '@platform/ui';
import { AccountDetailPage } from '../../pages/accounts/detail/ui/AccountDetailPage';
import { AccountsListPage } from '../../pages/accounts/list/ui/AccountsListPage';
import { ContactDetailPage } from '../../pages/contacts/detail/ui/ContactDetailPage';
import { ContactsListPage } from '../../pages/contacts/list/ui/ContactsListPage';
import { LeadDetailPage } from '../../pages/leads/detail/ui/LeadDetailPage';
import { LeadsListPage } from '../../pages/leads/list/ui/LeadsListPage';
import { OpportunityDetailPage } from '../../pages/opportunities/detail/ui/OpportunityDetailPage';
import { OpportunitiesListPage } from '../../pages/opportunities/list/ui/OpportunitiesListPage';
import { ProductDetailPage } from '../../pages/products/detail/ui/ProductDetailPage';
import { ProductsListPage } from '../../pages/products/list/ui/ProductsListPage';
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

      { path: RoutePatterns.ActivitiesList, element: <ActivitiesListPage /> },
      { path: RoutePatterns.ActivityNew, element: <ActivityDetailPage /> },
      { path: RoutePatterns.ActivityEdit, element: <ActivityDetailPage /> },
      { path: RoutePatterns.ActivityView, element: <ActivityDetailPage /> },

      { path: RoutePatterns.LeadsList, element: <LeadsListPage /> },
      { path: RoutePatterns.LeadNew, element: <LeadDetailPage /> },
      { path: RoutePatterns.LeadEdit, element: <LeadDetailPage /> },
      { path: RoutePatterns.LeadView, element: <LeadDetailPage /> },

      { path: RoutePatterns.OpportunitiesList, element: <OpportunitiesListPage /> },
      { path: RoutePatterns.OpportunityNew, element: <OpportunityDetailPage /> },
      { path: RoutePatterns.OpportunityEdit, element: <OpportunityDetailPage /> },
      { path: RoutePatterns.OpportunityView, element: <OpportunityDetailPage /> },

      { path: RoutePatterns.ProductsList, element: <ProductsListPage /> },
      { path: RoutePatterns.ProductNew, element: <ProductDetailPage /> },
      { path: RoutePatterns.ProductEdit, element: <ProductDetailPage /> },
      { path: RoutePatterns.ProductView, element: <ProductDetailPage /> },

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
