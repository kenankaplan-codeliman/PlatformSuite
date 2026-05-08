/**
 * TanStack Query anahtar fabrikası — Client_Architecture §5.
 * Inline key yazmak yerine buradan hiyerarşik tuple'lar üretilir.
 */
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

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

export const organizationKeys = {
  all: ['organization'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (params: unknown) => [...organizationKeys.lists(), params] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
};

export const appUserKeys = {
  all: ['app-user'] as const,
  lists: () => [...appUserKeys.all, 'list'] as const,
  list: (params: unknown) => [...appUserKeys.lists(), params] as const,
  details: () => [...appUserKeys.all, 'detail'] as const,
  detail: (id: string) => [...appUserKeys.details(), id] as const,
};

export const appRoleKeys = {
  all: ['app-role'] as const,
  lists: () => [...appRoleKeys.all, 'list'] as const,
  list: (params: unknown) => [...appRoleKeys.lists(), params] as const,
  details: () => [...appRoleKeys.all, 'detail'] as const,
  detail: (id: string) => [...appRoleKeys.details(), id] as const,
};

export const attachmentKeys = {
  all: ['attachment'] as const,
  byEntity: (entityType: string, entityId: string) =>
    [...attachmentKeys.all, 'byEntity', entityType, entityId] as const,
};
