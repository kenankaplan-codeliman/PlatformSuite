import type { LoginIntent, LoginState } from './intent';

/**
 * Saf reducer. Yan etki yok.
 */
export function loginReducer(state: LoginState, intent: LoginIntent): LoginState {
  switch (intent.type) {
    case 'SUBMIT_CREDENTIALS':
      return { status: 'submitting', error: null };
    case 'SUBMIT_SUCCESS':
      return { status: 'success', error: null };
    case 'SUBMIT_FAILURE':
      return { status: 'failure', error: intent.error };
    case 'RESET_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}
