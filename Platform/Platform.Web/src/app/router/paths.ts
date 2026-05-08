export const RoutePaths = {
  Home: '/',
  Login: '/auth/login',

  // Activity (polimorfik — :type ∈ phonecall|task|appointment|email)
  ActivitiesList: '/activities',
  ActivityNew: (type: string) => `/activities/new/${type}`,
  ActivityView: (type: string, id: string) => `/activities/${type}/${id}`,
  ActivityEdit: (type: string, id: string) => `/activities/${type}/${id}/edit`,

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
  ActivitiesList: '/activities',
  ActivityNew: '/activities/new/:type',
  ActivityView: '/activities/:type/:id',
  ActivityEdit: '/activities/:type/:id/edit',

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
