import {
  RoutePaths as PlatformRoutePaths,
  RoutePatterns as PlatformRoutePatterns,
} from '@platform/ui';

export const RoutePaths = {
  ...PlatformRoutePaths,

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
} as const;

export const RoutePatterns = {
  ...PlatformRoutePatterns,

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
} as const;
