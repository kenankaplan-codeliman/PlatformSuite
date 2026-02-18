import type { RedirectRequest } from '@azure/msal-browser';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from "@/config/msal.config";

/**
 * Scopes for initial login
 */
export const loginRequest: RedirectRequest = {
  scopes: ['User.Read', 'profile', 'email', 'openid'],
  prompt: 'select_account', // Force account selection screen
};

/**
 * Scopes for Microsoft Graph API calls
 */
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphMailEndpoint: 'https://graph.microsoft.com/v1.0/me/messages',
  graphPhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
};

/**
 * MSAL Instance
 * App başlatıldığında bir kere oluşturulur
 */
export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Initialize MSAL
 * App.tsx'te çağrılır
 */
/*
export const initializeMsal = async () => {
  await msalInstance.initialize();
};
*/