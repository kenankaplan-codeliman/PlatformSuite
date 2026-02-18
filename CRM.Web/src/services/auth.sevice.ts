import axios from 'axios';
import { ServicePath } from '@/config/service.paths';
import type { LoginRequest, LoginResponse, MsalRequest, RefreshTokenRequest, AccessTokenRequest, User } from '@/types/auth.types';


export const authService = {
    /**
   * Custom Email/Password Login
   */

  login: async (
    email: string, 
    password: string
  ): Promise<LoginResponse> => {

    const request : LoginRequest = {
      email: email,
      password: password
    };

    const response = await axios.post<LoginResponse>(
      `${ServicePath.Auth.Login}`,
      request
    );
    
    return response.data;
  },

  /**
   * Microsoft OAuth Callback
   * Send MSAL token to backend for validation and user creation
   * Backend will extract all user info from token claims
   * 
   * @param msalToken - MSAL access token from Microsoft
   */
  loginWithMicrosoft: async (msalToken: string): Promise<LoginResponse> =>{

      const request : MsalRequest = {
          msalToken: msalToken  
      };

      const response = await axios.post<LoginResponse>(
        `${ServicePath.Auth.MicrosoftCallback}`,
        request
      );
      
      return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {

    const request : RefreshTokenRequest = {
          refreshToken: refreshToken    
      };
    
    const response = await axios.post<LoginResponse>(
        `${ServicePath.Auth.RefreshToken}`,
        request
      );
      
    return response.data;
  },

  /**
   * Logout - invalidate tokens
   */
  logout: async (accessToken: string): Promise<void> => {
      
    const request : AccessTokenRequest = {
        accessToken: accessToken    
      };

    await axios.post(
      `${ServicePath.Auth.Logout}`,
      request
    );
  },

    /**
   * fetchUser - Get current user info using access token
   */
  fetchUser: async (accessToken: string): Promise<User> => {
      
      const response = await axios.post(
        `${ServicePath.Auth.Me}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
  },

}

export default authService;