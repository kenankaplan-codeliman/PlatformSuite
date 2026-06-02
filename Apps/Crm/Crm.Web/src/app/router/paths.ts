import {
  RoutePaths as PlatformRoutePaths,
  RoutePatterns as PlatformRoutePatterns,
} from '@platform/ui';

export const RoutePaths = {
  ...PlatformRoutePaths,

  // Account
  AccountsList: '/accounts',
  AccountNew: '/accounts/new',
  AccountView: (id: string) => `/accounts/${id}`,
  AccountEdit: (id: string) => `/accounts/${id}/edit`,

  // Contact
  ContactsList: '/contacts',
  ContactNew: '/contacts/new',
  ContactView: (id: string) => `/contacts/${id}`,
  ContactEdit: (id: string) => `/contacts/${id}/edit`,

  // Lead
  LeadsList: '/leads',
  LeadNew: '/leads/new',
  LeadView: (id: string) => `/leads/${id}`,
  LeadEdit: (id: string) => `/leads/${id}/edit`,

  // Opportunity
  OpportunitiesList: '/opportunities',
  OpportunityNew: '/opportunities/new',
  OpportunityView: (id: string) => `/opportunities/${id}`,
  OpportunityEdit: (id: string) => `/opportunities/${id}/edit`,

  // Product
  ProductsList: '/products',
  ProductNew: '/products/new',
  ProductView: (id: string) => `/products/${id}`,
  ProductEdit: (id: string) => `/products/${id}/edit`,
} as const;

export const RoutePatterns = {
  ...PlatformRoutePatterns,

  // Account
  AccountsList: '/accounts',
  AccountNew: '/accounts/new',
  AccountView: '/accounts/:id',
  AccountEdit: '/accounts/:id/edit',

  // Contact
  ContactsList: '/contacts',
  ContactNew: '/contacts/new',
  ContactView: '/contacts/:id',
  ContactEdit: '/contacts/:id/edit',

  // Lead
  LeadsList: '/leads',
  LeadNew: '/leads/new',
  LeadView: '/leads/:id',
  LeadEdit: '/leads/:id/edit',

  // Opportunity
  OpportunitiesList: '/opportunities',
  OpportunityNew: '/opportunities/new',
  OpportunityView: '/opportunities/:id',
  OpportunityEdit: '/opportunities/:id/edit',

  // Product
  ProductsList: '/products',
  ProductNew: '/products/new',
  ProductView: '/products/:id',
  ProductEdit: '/products/:id/edit',
} as const;
