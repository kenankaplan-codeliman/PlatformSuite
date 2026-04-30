/**
 * CRM-spesifik TanStack Query anahtar fabrikaları — Platform queryKeys (account, auth)
 * @platform/ui'dan gelir. Burada Lead ve Opportunity için aynı paterndeki anahtarlar üretilir.
 */
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
