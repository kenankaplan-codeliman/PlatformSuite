export const ServiceBasePath = import.meta.env.VITE_API_BASE_URL;
export const ControllerPaths = {
  AuthPath: `${ServiceBasePath}/auth`,
  LeadPath: `${ServiceBasePath}/api/lead`,
} as const;


export const ServicePath = {
    // Authentication
    Auth: {
        Login: `${ControllerPaths.AuthPath}/login`,
        MicrosoftCallback: `${ControllerPaths.AuthPath}/microsoft/callback`,
        RefreshToken: `${ControllerPaths.AuthPath}/refresh`,
        Logout: `${ControllerPaths.AuthPath}/logout`,
        Me: `${ControllerPaths.AuthPath}/me`,
    },

    // Leads
    Lead: {
        List: `${ControllerPaths.LeadPath}/list`,
        Get: `${ControllerPaths.LeadPath}/get`,
        Create: `${ControllerPaths.LeadPath}/create`,
        Update: `${ControllerPaths.LeadPath}/update`,
        Delete: `${ControllerPaths.LeadPath}/delete`,
        BulkDelete: `${ControllerPaths.LeadPath}/bulk-delete`,
        BulkUpdateStatus: `${ControllerPaths.LeadPath}/bulk-update-status`,
    }
};

export default ServicePath;