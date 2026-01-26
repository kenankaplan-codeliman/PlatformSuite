export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        MICROSOFT_CALLBACK: '/auth/microsoft/callback',
        REFRESH_TOKEN: '/auth/refresh',
        LOGOUT: '/auth/logout',
    },

    // Leads
    LEAD: {
        BASE: '/api/leads',
        LIST: '/list',
        BY_ID: (id: string) => `/api/leads/${id}`,
    }
};
