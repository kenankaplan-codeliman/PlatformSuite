/**
 * Merkezi servis yolları — backend Controller route'ları ile birebir.
 * Hard-coded path yerine buradan tüketilir.
 */
const AuthBase = '/auth';
const ApiBase = '/api';

export const ControllerPaths = {
  Auth: AuthBase,
  Account: `${ApiBase}/account`,
  Contact: `${ApiBase}/contact`,
  Activity: `${ApiBase}/activity`,
  User: `${ApiBase}/user`,
  AppOrganization: `${ApiBase}/app-organization`,
  AppRole: `${ApiBase}/app-role`,
  Attachment: `${ApiBase}/attachment`,
  Reference: `${ApiBase}/reference`,
  GeneralParameter: `${ApiBase}/general-parameter`,
  EntityMetadata: `${ApiBase}/entity-metadata`,
} as const;

export const ServicePath = {
  Auth: {
    Login: `${ControllerPaths.Auth}/login`,
    Logout: `${ControllerPaths.Auth}/logout`,
    Refresh: `${ControllerPaths.Auth}/refresh`,
    Me: `${ControllerPaths.Auth}/me`,
    MicrosoftCallback: `${ControllerPaths.Auth}/microsoft/callback`,
  },
  User: {
    List: `${ControllerPaths.User}/list`,
    Search: `${ControllerPaths.User}/search`,
    Get: `${ControllerPaths.User}/get`,
    Create: `${ControllerPaths.User}/create`,
    Update: `${ControllerPaths.User}/update`,
    Delete: `${ControllerPaths.User}/delete`,
    UpdateRoles: `${ControllerPaths.User}/update-roles`,
    ChangePassword: `${ControllerPaths.User}/change-password`,
  },
  AppRole: {
    List: `${ControllerPaths.AppRole}/list`,
    Get: `${ControllerPaths.AppRole}/get`,
    Create: `${ControllerPaths.AppRole}/create`,
    Update: `${ControllerPaths.AppRole}/update`,
    Delete: `${ControllerPaths.AppRole}/delete`,
  },
  Account: {
    List: `${ControllerPaths.Account}/list`,
    Search: `${ControllerPaths.Account}/search`,
    Get: `${ControllerPaths.Account}/get`,
    Create: `${ControllerPaths.Account}/create`,
    Update: `${ControllerPaths.Account}/update`,
    Delete: `${ControllerPaths.Account}/delete`,
    SetState: `${ControllerPaths.Account}/set-state`,
  },
  Contact: {
    List: `${ControllerPaths.Contact}/list`,
    Search: `${ControllerPaths.Contact}/search`,
    Get: `${ControllerPaths.Contact}/get`,
    Create: `${ControllerPaths.Contact}/create`,
    Update: `${ControllerPaths.Contact}/update`,
    Delete: `${ControllerPaths.Contact}/delete`,
    SetState: `${ControllerPaths.Contact}/set-state`,
  },
  Activity: {
    List: `${ControllerPaths.Activity}/list`,
    Calendar: `${ControllerPaths.Activity}/calendar`,
    GetPhoneCall: `${ControllerPaths.Activity}/get/phonecall`,
    GetTask: `${ControllerPaths.Activity}/get/task`,
    GetAppointment: `${ControllerPaths.Activity}/get/appointment`,
    GetEmail: `${ControllerPaths.Activity}/get/email`,
    CreatePhoneCall: `${ControllerPaths.Activity}/create/phonecall`,
    CreateTask: `${ControllerPaths.Activity}/create/task`,
    CreateAppointment: `${ControllerPaths.Activity}/create/appointment`,
    CreateEmail: `${ControllerPaths.Activity}/create/email`,
    UpdatePhoneCall: `${ControllerPaths.Activity}/update/phonecall`,
    UpdateTask: `${ControllerPaths.Activity}/update/task`,
    UpdateAppointment: `${ControllerPaths.Activity}/update/appointment`,
    UpdateEmail: `${ControllerPaths.Activity}/update/email`,
    Delete: `${ControllerPaths.Activity}/delete`,
    Complete: `${ControllerPaths.Activity}/complete`,
    Cancel: `${ControllerPaths.Activity}/cancel`,
    BulkUpdateStatus: `${ControllerPaths.Activity}/bulk-update-status`,
    Assign: `${ControllerPaths.Activity}/assign`,
    SetState: `${ControllerPaths.Activity}/set-state`,
  },
  AppOrganization: {
    List: `${ControllerPaths.AppOrganization}/list`,
    Search: `${ControllerPaths.AppOrganization}/search`,
    Get: `${ControllerPaths.AppOrganization}/get`,
    Create: `${ControllerPaths.AppOrganization}/create`,
    Update: `${ControllerPaths.AppOrganization}/update`,
    Delete: `${ControllerPaths.AppOrganization}/delete`,
  },
  Attachment: {
    List: `${ControllerPaths.Attachment}/list`,
    /** Draft (relation'sız) upload — entity ile ilişkilendirme parent CreateXCommand içinde yapılır. */
    UploadDraft: `${ControllerPaths.Attachment}/upload-draft`,
    /** GET stream — id append edilir */
    Download: `${ControllerPaths.Attachment}/download`,
    Delete: `${ControllerPaths.Attachment}/delete`,
  },
  /**
   * Polimorfik EntityReference arama. Body:
   *   { entityType: string, searchText?: string, pagination: { pageNumber, pageSize } }
   * Sunucu tarafında IEntityReferenceResolverRegistry üzerinden ilgili resolver'a delege eder.
   */
  Reference: {
    Lookup: `${ControllerPaths.Reference}/lookup`,
  },
  /**
   * Dinamik enum/parametre verisi. Body: { parentCode?: string }
   * parentCode verilirse o grubun değer satırları, verilmezse tüm parametreler döner.
   */
  GeneralParameter: {
    List: `${ControllerPaths.GeneralParameter}/list`,
  },
  /**
   * Tipten bağımsız ortak entity metadata'sı (audit / owner / state).
   * Body: { entityType: string, id: string }. Detail sayfası footer'ı tüketir.
   */
  EntityMetadata: {
    Get: `${ControllerPaths.EntityMetadata}/get`,
  },
} as const;
