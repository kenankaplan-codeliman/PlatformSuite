export const ServiceBasePath = import.meta.env.VITE_API_BASE_URL;
export const ControllerPaths = {
  AuthPath: `${ServiceBasePath}/auth`,
  LeadPath: `${ServiceBasePath}/api/lead`,
  ActivityPath: `${ServiceBasePath}/api/activity`,
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
    },

    Activity: {
        List: `${ControllerPaths.ActivityPath}/list`,
        Get: `${ControllerPaths.ActivityPath}/get`,
        Create: `${ControllerPaths.ActivityPath}/create`,
        Update: `${ControllerPaths.ActivityPath}/update`,
        Delete: `${ControllerPaths.ActivityPath}/delete`,
        BulkDelete: `${ControllerPaths.ActivityPath}/bulk-delete`,
        BulkUpdateStatus: `${ControllerPaths.ActivityPath}/bulk-update-status`,
        Complete: `${ControllerPaths.ActivityPath}/complete`,
        Cancel: `${ControllerPaths.ActivityPath}/cancel`,
        Calendar: `${ControllerPaths.ActivityPath}/calendar`,
        Export: `${ControllerPaths.ActivityPath}/export`,
    },
};

export default ServicePath;