export const EndpointBasePath = import.meta.env.VITE_API_BASE_URL;
export const ControllerPaths = {
  AuthPath: `${EndpointBasePath}/auth`,
  LeadPath: `${EndpointBasePath}/api/lead`,
} as const;


export const EndPointPaths = {
    // Authentication
    Auth: {
        Login: `${ControllerPaths.AuthPath}/login`,
        MicrosoftCallback: `${ControllerPaths.AuthPath}/microsoft/callback`,
        RefreshToken: `${ControllerPaths.AuthPath}/refresh`,
        Logout: `${ControllerPaths.AuthPath}/logout`,
    },

    // Leads
    Lead: {
        List: `${ControllerPaths.LeadPath}/list`,
        BY_ID: (id: string) => `${ControllerPaths.LeadPath}/${id}`,
    }
};

export default EndPointPaths;