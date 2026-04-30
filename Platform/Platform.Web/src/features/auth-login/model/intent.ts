import type { AppError } from '../../../shared/types/ApiError';

/**
 * MVI intent'leri — login feature'ının lokal state geçişleri.
 */
export type LoginIntent =
  | { type: 'SUBMIT_CREDENTIALS'; email: string; password: string }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_FAILURE'; error: AppError }
  | { type: 'RESET_ERROR' };

export interface LoginState {
  status: 'idle' | 'submitting' | 'success' | 'failure';
  error: AppError | null;
}

export const initialLoginState: LoginState = {
  status: 'idle',
  error: null,
};
