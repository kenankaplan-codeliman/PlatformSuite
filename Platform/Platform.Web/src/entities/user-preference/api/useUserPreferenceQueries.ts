import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { preferenceKeys } from '../../../shared/api/queryKeys';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import type { AppError } from '../../../shared/types/ApiError';
import { userPreferenceDataSource } from './userPreferenceDataSource';
import type { UserPreferenceItem } from '../model/types';

/** Generic kullanıcı tercihini anahtara göre getirir. */
export function useUserPreference(key: string) {
  return useQuery({
    queryKey: preferenceKeys.byKey(key),
    queryFn: () => userPreferenceDataSource.get(key),
    staleTime: 5 * 60_000,
  });
}

/** Generic kullanıcı tercihini upsert eder (anahtar + opak JSON value). */
export function useSaveUserPreference() {
  const queryClient = useQueryClient();

  return useMutation<UserPreferenceItem, AppError, { key: string; value: string }>({
    mutationFn: async ({ key, value }) => {
      try {
        return await userPreferenceDataSource.save(key, value);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(preferenceKeys.byKey(saved.key), saved);
    },
  });
}
