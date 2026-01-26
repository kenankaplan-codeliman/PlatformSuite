import type { Configuration } from '@azure/msal-browser';


/**
 * Microsoft Entra ID (formerly Azure AD) Configuration
 * 
 * ⚠️ IMPORTANT: Azure Active Directory is now called "Microsoft Entra ID"
 * 
 * SETUP INSTRUCTIONS (2026):
 * 
 * 1. Go to Microsoft Entra admin center:
 *    - Direct link: https://entra.microsoft.com
 *    - Or Azure Portal: https://portal.azure.com (search "Microsoft Entra ID")
 * 
 * 2. Navigate to "App registrations" > "+ New registration"
 * 
 * 3. Fill in the registration form:
 *    - Name: CRM Application
 *    - Supported account types: "Accounts in this organizational directory only (Single tenant)"
 *    - Redirect URI: 
 *      - Platform: Single-page application (SPA)
 *      - URI: http://localhost:3000
 * 
 * 4. After registration, go to "Authentication":
 *    - Under "Implicit grant and hybrid flows", check:
 *      ✅ Access tokens (used for implicit flows)
 *      ✅ ID tokens (used for implicit and hybrid flows)
 *    - Click "Save"
 * 
 * 5. Go to "API permissions":
 *    - Click "+ Add a permission" > "Microsoft Graph" > "Delegated permissions"
 *    - Add: User.Read, profile, email, openid
 *    - (Optional) Click "Grant admin consent"
 * 
 * 6. Go to "Overview" page and copy:
 *    - Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *    - Directory (tenant) ID: yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
 * 
 * 7. Paste these values below in clientId and authority
 * 
 * See MICROSOFT-ENTRA-SETUP.md for detailed step-by-step guide with screenshots!
 */

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID, // Application (client) ID from Azure Portal
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`, // Directory (tenant) ID
    redirectUri: window.location.origin, 
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage', // "sessionStorage" or "localStorage"
    storeAuthStateInCookie: false, // Set to true for IE 11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case 0: // LogLevel.Error
            console.error(message);
            break;
          case 1: // LogLevel.Warning
            console.warn(message);
            break;
          case 2: // LogLevel.Info
            console.info(message);
            break;
          case 3: // LogLevel.Verbose
            console.debug(message);
            break;
        }
      },
    },
  },
};