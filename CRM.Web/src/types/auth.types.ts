export interface User {
    id: string;
    email: string;
    displayName: string;
    profilePictureUrl?: string;
    organizationId: string;
    organizationName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface MsalRequest {
    msalToken: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface AccessTokenRequest {
    accessToken: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface MicrosoftCallbackRequest {
    code: string;
    state: string;
}
