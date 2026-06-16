/**
 * CRM-spesifik TanStack Query anahtar fabrikaları. Account/Contact CRM'e taşındı;
 * key'ler de bu paketten servis edilir. Activity/Auth gibi platform-seviyesi key'ler
 * @platform/ui'dan gelir.
 */
export const accountKeys = {
  all: ['account'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (params: unknown) => [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
};

export const contactKeys = {
  all: ['contact'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (params: unknown) => [...contactKeys.lists(), params] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};

export const leadKeys = {
  all: ['lead'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: (params: unknown) => [...leadKeys.lists(), params] as const,
  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadKeys.details(), id] as const,
};

export const opportunityKeys = {
  all: ['opportunity'] as const,
  lists: () => [...opportunityKeys.all, 'list'] as const,
  list: (params: unknown) => [...opportunityKeys.lists(), params] as const,
  details: () => [...opportunityKeys.all, 'detail'] as const,
  detail: (id: string) => [...opportunityKeys.details(), id] as const,
};

export const productKeys = {
  all: ['product'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: unknown) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Dashboard key'leri: her widget bağımsız cache'lenir (widget anahtarı + opsiyonel parametre),
 * kişisel layout tercihi ayrı.
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  widgets: () => [...dashboardKeys.all, 'widget'] as const,
  widget: (key: string, params?: unknown) => [...dashboardKeys.widgets(), key, params] as const,
};
