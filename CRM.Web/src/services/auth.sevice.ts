import axios from 'axios';
import { EndPointPaths } from '@/constants/endpoint.paths';
import type{ User } from '@/stores/auth.store';

export interface LoginResponse {
  user: User;
  accessToken: string;
  accessTokenExpireAt: Date;
  refreshToken: string;
  refreshTokenExpireAt: Date;
}

export interface MicrosoftCallbackRequest {
  code: string;
  state: string;
}

class AuthService {
  /**
   * Custom Email/Password Login
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${EndPointPaths.Auth.Login}`,
        { email, password }
      );
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Microsoft OAuth Callback
   * Send MSAL token to backend for validation and user creation
   * Backend will extract all user info from token claims
   * 
   * @param msalToken - MSAL access token from Microsoft
   */
  async microsoftCallback(msalToken: string): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${EndPointPaths.Auth.MicrosoftCallback}`,
        { token: msalToken }
      );
      
      return response.data;
    } catch (error) {
      console.error('Microsoft callback failed:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${EndPointPaths.Auth.RefreshToken}`,
        { refreshToken }
      );
      
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }


  /**
   * Logout - invalidate tokens
   */
  async logout(accessToken: string): Promise<void> {
    try {
      await axios.post(
        `${EndPointPaths.Auth.Logout}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();