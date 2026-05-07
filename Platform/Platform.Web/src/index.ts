// Platform.Web public API.
// Apps/<app>/<app>.Web bu barrel'dan import eder.

// ─── App-level ───────────────────────────────────────────────────────────────
export { AppProviders } from './app/providers/AppProviders';
export { AuthGuard } from './app/router/guards/AuthGuard';
export { RoutePaths, RoutePatterns } from './app/router/paths';

// ─── Sayfalar ────────────────────────────────────────────────────────────────
export { LoginPage } from './pages/auth/login/ui/LoginPage';
export { HomePage } from './pages/home/ui/HomePage';
export { AccountsListPage } from './pages/accounts/list/ui/AccountsListPage';
export { AccountDetailPage } from './pages/accounts/detail/ui/AccountDetailPage';
export { OrganizationsListPage } from './pages/organizations/list/ui/OrganizationsListPage';
export { OrganizationDetailPage } from './pages/organizations/detail/ui/OrganizationDetailPage';
export { AppUsersListPage } from './pages/users/list/ui/AppUsersListPage';
export { AppUserDetailPage } from './pages/users/detail/ui/AppUserDetailPage';
export { AppRolesListPage } from './pages/app-roles/list/ui/AppRolesListPage';
export { AppRoleDetailPage } from './pages/app-roles/detail/ui/AppRoleDetailPage';

// ─── Widget'lar (cross-cutting bileşenler) ──────────────────────────────────
export { AttachmentPanel } from './widgets/attachment/ui/AttachmentPanel';
export { AttachmentList } from './widgets/attachment/ui/AttachmentList';
export { AttachmentUpload } from './widgets/attachment/ui/AttachmentUpload';
export { AttachmentCard } from './widgets/attachment/ui/AttachmentCard';
export { AppShell } from './widgets/app-shell/ui/AppShell';
export type { AppShellProps } from './widgets/app-shell/ui/AppShell';
export { AppMetaProvider, useAppMeta } from './shared/lib/app-meta/AppMetaContext';
export type { AppMeta, AppMetaProviderProps } from './shared/lib/app-meta/AppMetaContext';
export {
  isMenuGroup,
  type MenuItem,
  type MenuGroup,
  type MenuSchema,
} from './widgets/app-sidebar/model/types';

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
  AppUserRoleItem,
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
  useUploadAttachment,
  useDeleteAttachment,
} from './entities/attachment/api/useAttachmentMutations';
export { attachmentDataSource } from './entities/attachment/api/attachmentDataSource';
export type {
  AttachmentMetadataItem,
  DocumentType,
  UploadAttachmentInput,
} from './entities/attachment/model/types';

// ─── Shared UI primitifleri ──────────────────────────────────────────────────
export { Button } from './shared/ui/Button';
export { Card } from './shared/ui/Card';
export { DataTable, type DataTableColumn } from './shared/ui/DataTable';
export { Alert } from './shared/ui/feedback/Alert';
export { Spinner } from './shared/ui/feedback/Spinner';
export { DetailPageLayout } from './shared/ui/detail-page/DetailPageLayout';
export { ListPageLayout } from './shared/ui/list-page/ListPageLayout';
export { FormSection } from './shared/ui/form/FormSection';
export { TextField } from './shared/ui/form/fields/TextField';
export { NumberField } from './shared/ui/form/fields/NumberField';
export { SelectField, type SelectOption } from './shared/ui/form/fields/SelectField';
export { TextAreaField } from './shared/ui/form/fields/TextAreaField';
export { PasswordField } from './shared/ui/form/fields/PasswordField';
export { EntityLookupField } from './shared/ui/form/fields/EntityLookupField';

// ─── API katmanı ─────────────────────────────────────────────────────────────
export { httpClient } from './shared/api/httpClient';
export { ServicePath } from './shared/api/servicePaths';
export { mapAxiosError } from './shared/api/errorMapper';
export { accountKeys, authKeys, organizationKeys, appUserKeys, appRoleKeys, attachmentKeys } from './shared/api/queryKeys';

// ─── Hook'lar ────────────────────────────────────────────────────────────────
export { useRouteMode } from './shared/hooks/useRouteMode';
export { useFormMode } from './shared/ui/form/useFormMode';
export { useEnumTranslation } from './shared/lib/i18n/enum';

// ─── Tipler + sabitler ───────────────────────────────────────────────────────
export type { FormMode } from './shared/types/FormMode';
export type { AppError, ProblemDetails, ValidationProblemDetails } from './shared/types/ApiError';
export type { PagedResult, PaginationRequest, PaginationResponse } from './shared/types/Pagination';
export { defaultPaginationRequest } from './shared/types/Pagination';
export type { EntityReference } from './shared/types/EntityReference';
export { entityReferenceSchema } from './shared/types/EntityReference';
