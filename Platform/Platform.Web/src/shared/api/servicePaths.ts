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
  AppOrganization: {
    List: `${ControllerPaths.AppOrganization}/list`,
    Get: `${ControllerPaths.AppOrganization}/get`,
    Create: `${ControllerPaths.AppOrganization}/create`,
    Update: `${ControllerPaths.AppOrganization}/update`,
    Delete: `${ControllerPaths.AppOrganization}/delete`,
  },
  Attachment: {
    List: `${ControllerPaths.Attachment}/list`,
    Upload: `${ControllerPaths.Attachment}/upload`,
    /** GET stream — id append edilir */
    Download: `${ControllerPaths.Attachment}/download`,
    Delete: `${ControllerPaths.Attachment}/delete`,
  },
} as const;
