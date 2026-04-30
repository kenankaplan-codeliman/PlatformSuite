export const RoutePaths = {
  Home: '/',
  Login: '/auth/login',

  // Account
  AccountsList: '/accounts',
  AccountNew: '/accounts/new',
  AccountView: (id: string) => `/accounts/${id}`,
  AccountEdit: (id: string) => `/accounts/${id}/edit`,

  // Organization (AppOrganization)
  OrganizationsList: '/organizations',
  OrganizationNew: '/organizations/new',
  OrganizationView: (id: string) => `/organizations/${id}`,
  OrganizationEdit: (id: string) => `/organizations/${id}/edit`,

  // AppUser
  AppUsersList: '/users',
  AppUserNew: '/users/new',
  AppUserView: (id: string) => `/users/${id}`,
  AppUserEdit: (id: string) => `/users/${id}/edit`,

  // AppRole
  AppRolesList: '/app-roles',
  AppRoleNew: '/app-roles/new',
  AppRoleView: (id: string) => `/app-roles/${id}`,
  AppRoleEdit: (id: string) => `/app-roles/${id}/edit`,
} as const;

export const RoutePatterns = {
  AccountsList: '/accounts',
  AccountNew: '/accounts/new',
  AccountView: '/accounts/:id',
  AccountEdit: '/accounts/:id/edit',

  OrganizationsList: '/organizations',
  OrganizationNew: '/organizations/new',
  OrganizationView: '/organizations/:id',
  OrganizationEdit: '/organizations/:id/edit',

  AppUsersList: '/users',
  AppUserNew: '/users/new',
  AppUserView: '/users/:id',
  AppUserEdit: '/users/:id/edit',

  AppRolesList: '/app-roles',
  AppRoleNew: '/app-roles/new',
  AppRoleView: '/app-roles/:id',
  AppRoleEdit: '/app-roles/:id/edit',
} as const;
