// Platform.Web public API.
// Apps/<app>/<app>.Web bu barrel'dan import eder.

// ─── App-level ───────────────────────────────────────────────────────────────
export { AppProviders } from './app/providers/AppProviders';
export { AuthGuard } from './app/router/guards/AuthGuard';
export { RoutePaths, RoutePatterns } from './app/router/paths';

// ─── Sayfalar ────────────────────────────────────────────────────────────────
export { LoginPage } from './pages/auth/login/ui/LoginPage';
export { HomePage } from './pages/home/ui/HomePage';
export { ActivitiesListPage } from './pages/activities/list/ui/ActivitiesListPage';
export { ActivityDetailPage } from './pages/activities/detail/ui/ActivityDetailPage';
export { OrganizationsListPage } from './pages/organizations/list/ui/OrganizationsListPage';
export { OrganizationDetailPage } from './pages/organizations/detail/ui/OrganizationDetailPage';
export { AppUsersListPage } from './pages/users/list/ui/AppUsersListPage';
export { AppUserDetailPage } from './pages/users/detail/ui/AppUserDetailPage';
export { AppRolesListPage } from './pages/app-roles/list/ui/AppRolesListPage';
export { AppRoleDetailPage } from './pages/app-roles/detail/ui/AppRoleDetailPage';

// ─── Widget'lar (cross-cutting bileşenler) ──────────────────────────────────
export { AttachmentsField } from './widgets/attachment/ui/AttachmentsField';
export type { AttachmentsFieldProps } from './widgets/attachment/ui/AttachmentsField';
export { AttachmentSection } from './widgets/attachment/ui/AttachmentSection';
export type { AttachmentSectionProps } from './widgets/attachment/ui/AttachmentSection';
export { AttachmentAddPanel } from './widgets/attachment/ui/AttachmentAddPanel';
export type { AttachmentAddPanelProps, DocumentTypeOption } from './widgets/attachment/ui/AttachmentAddPanel';
export { commonDocumentTypes } from './widgets/attachment/lib/commonDocumentTypes';
export {
  AttachmentsProvider,
  useAttachmentsCollector,
} from './widgets/attachment/model/AttachmentsContext';
export type {
  AttachmentsContextValue,
  AttachmentsProviderProps,
} from './widgets/attachment/model/AttachmentsContext';
export { AppShell } from './widgets/app-shell/ui/AppShell';
export type { AppShellProps } from './widgets/app-shell/ui/AppShell';
export { AppMetaProvider, useAppMeta } from './shared/lib/app-meta/AppMetaContext';
export type { AppMeta, AppMetaProviderProps } from './shared/lib/app-meta/AppMetaContext';
export {
  ActivityEntityTypesProvider,
  useActivityEntityTypes,
} from './shared/lib/activity/ActivityEntityTypesContext';
export type {
  ActivityEntityTypesValue,
  ActivityEntityTypesProviderProps,
} from './shared/lib/activity/ActivityEntityTypesContext';
export {
  EntityTypeRegistryProvider,
  useEntityType,
  useEntityTypeRegistry,
} from './shared/lib/entity-type/EntityTypeRegistryContext';
export type {
  EntityTypeRegistryValue,
  EntityTypeRegistryProviderProps,
} from './shared/lib/entity-type/EntityTypeRegistryContext';
export type {
  EntityTypeKey,
  EntityTypeMeta,
  EntityTone,
  EntityIcon,
} from './shared/lib/entity-type/types';
export { toneToTagColor } from './shared/lib/entity-type/tone';
export { platformEntityTypes } from './shared/lib/entity-type/platformEntityTypes';
export type { EntityLookupOption } from './shared/ui/form/fields/EntityLookupField';
export {
  isMenuGroup,
  type MenuItem,
  type MenuGroup,
  type MenuSchema,
} from './widgets/app-sidebar/model/types';
export {
  entityMenuItem,
  type EntityMenuItemOverrides,
} from './widgets/app-sidebar/lib/entityMenuItem';

// ─── AppUser / AppRole entities ─────────────────────────────────────────────
export { useAppUserQuery, useAppUserListQuery } from './entities/app-user/api/useAppUserQueries';
export {
  useUpsertAppUser,
  useDeleteAppUser,
  useUpdateAppUserRoles,
  useChangeAppUserPassword,
} from './entities/app-user/api/useAppUserMutations';
export { appUserDataSource } from './entities/app-user/api/appUserDataSource';
export type {
  AppUserDetailItem,
  AppUserListItem,
  AppUserListFilter,
  AppUserFormValues,
} from './entities/app-user/model/types';

export { useAppRoleQuery, useAppRoleListQuery } from './entities/app-role/api/useAppRoleQueries';
export {
  useUpsertAppRole,
  useDeleteAppRole,
} from './entities/app-role/api/useAppRoleMutations';
export { appRoleDataSource } from './entities/app-role/api/appRoleDataSource';
export type {
  AppRoleDetailItem,
  AppRoleListItem,
  AppRoleListFilter,
  AppRoleFormValues,
  AppRolePrivilegeItem,
  AccessLevel,
} from './entities/app-role/model/types';

// ─── Attachment entity ──────────────────────────────────────────────────────
export { useAttachmentListByEntity } from './entities/attachment/api/useAttachmentQueries';
export {
  useUploadAttachmentDraft,
  useDeleteAttachment,
} from './entities/attachment/api/useAttachmentMutations';
export { attachmentDataSource } from './entities/attachment/api/attachmentDataSource';
export type {
  AttachmentMetadataItem,
  AttachmentAssociation,
  UploadAttachmentDraftInput,
} from './entities/attachment/model/types';

// ─── Shared UI primitifleri ──────────────────────────────────────────────────
export { Button } from './shared/ui/Button';
export { Card } from './shared/ui/Card';
export { Dropdown, type DropdownItem } from './shared/ui/Dropdown';
export { DataTable, type DataTableColumn } from './shared/ui/DataTable';
export { Alert } from './shared/ui/feedback/Alert';
export { Spinner } from './shared/ui/feedback/Spinner';
export { EmptyState, type EmptyStateProps } from './shared/ui/feedback/EmptyState';
export { DetailPageLayout } from './shared/ui/detail-page/DetailPageLayout';
export type { DetailPageTab, DetailPageAction } from './shared/ui/detail-page/DetailPageLayout';
export { EntityMetadataFooter } from './shared/ui/detail-page/EntityMetadataFooter';
export type { EntityMetadataFooterProps } from './shared/ui/detail-page/EntityMetadataFooter';
export { useEntityMetadata, entityMetadataDataSource } from './shared/api/entityMetadata';
export type { EntityMetadata } from './shared/api/entityMetadata';
export { RelatedActivitiesTab } from './widgets/related-activities/ui/RelatedActivitiesTab';
export type { RelatedActivitiesTabProps } from './widgets/related-activities/ui/RelatedActivitiesTab';
export { ListPageLayout } from './shared/ui/list-page/ListPageLayout';
export { FilterPanel, type FilterPanelProps } from './shared/ui/list-page/FilterPanel';
export { FormSection } from './shared/ui/form/FormSection';
export { FormRow } from './shared/ui/form/FormRow';
export { TextField } from './shared/ui/form/fields/TextField';
export { NumberField } from './shared/ui/form/fields/NumberField';
export { SelectField, type SelectOption } from './shared/ui/form/fields/SelectField';
export { TextAreaField } from './shared/ui/form/fields/TextAreaField';
export { DateTimeField } from './shared/ui/form/fields/DateTimeField';
export { PasswordField } from './shared/ui/form/fields/PasswordField';
export { EntityLookupField } from './shared/ui/form/fields/EntityLookupField';
export { EntityRelationTable } from './shared/ui/form/fields/EntityRelationTable';
export { CheckboxField } from './shared/ui/form/fields/CheckboxField';

// ─── API katmanı ─────────────────────────────────────────────────────────────
export { httpClient } from './shared/api/httpClient';
export { ServicePath } from './shared/api/servicePaths';
export { mapAxiosError } from './shared/api/errorMapper';
export { activityKeys, authKeys, organizationKeys, appUserKeys, appRoleKeys, attachmentKeys, parameterKeys } from './shared/api/queryKeys';

// ─── Hook'lar ────────────────────────────────────────────────────────────────
export { useRouteMode } from './shared/hooks/useRouteMode';
export { useUrlFilters } from './shared/hooks/useUrlFilters';
export type { UseUrlFiltersOptions, UseUrlFiltersReturn } from './shared/hooks/useUrlFilters';
export { useFormMode } from './shared/ui/form/useFormMode';
export { useEnumTranslation } from './shared/lib/i18n/enum';
export { enumToOptions } from './shared/lib/options/enumToOptions';
export { useGeneralParameters } from './shared/hooks/useGeneralParameters';
export type {
  GeneralParameterItem,
  UseGeneralParametersResult,
} from './shared/hooks/useGeneralParameters';

// ─── Tipler + sabitler ───────────────────────────────────────────────────────
export type { FormMode } from './shared/types/FormMode';
export type { AppError, ProblemDetails, ValidationProblemDetails } from './shared/types/ApiError';
export type { PagedResult, PaginationRequest, PaginationResponse } from './shared/types/Pagination';
export { defaultPaginationRequest } from './shared/types/Pagination';
export type { EntityReference } from './shared/types/EntityReference';
export { entityReferenceSchema } from './shared/types/EntityReference';
