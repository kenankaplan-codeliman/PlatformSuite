/**
 * TanStack Query anahtar fabrikası — Client_Architecture §5.
 * Inline key yazmak yerine buradan hiyerarşik tuple'lar üretilir.
 */
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

export const activityKeys = {
  all: ['activity'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (params: unknown) => [...activityKeys.lists(), params] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (type: string, id: string) =>
    [...activityKeys.details(), type, id] as const,
  calendars: () => [...activityKeys.all, 'calendar'] as const,
  calendar: (params: unknown) => [...activityKeys.calendars(), params] as const,
};

export const entityMetadataKeys = {
  all: ['entity-metadata'] as const,
  detail: (entityType: string, id: string) =>
    [...entityMetadataKeys.all, entityType, id] as const,
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
  privilegeCatalog: () => [...appRoleKeys.all, 'privilege-catalog'] as const,
};

export const attachmentKeys = {
  all: ['attachment'] as const,
  byEntity: (entityType: string, entityId: string) =>
    [...attachmentKeys.all, 'byEntity', entityType, entityId] as const,
};

export const parameterKeys = {
  all: ['general-parameter'] as const,
  list: (parentCode: string, lang: string) =>
    [...parameterKeys.all, 'list', parentCode, lang] as const,
};
