import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appUserKeys } from '../../../shared/api/queryKeys';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import type { AppError } from '../../../shared/types/ApiError';
import { appUserDataSource } from './appUserDataSource';
import type {
  AppUserDetailItem,
  AppUserFormValues,
} from '../model/types';

/**
 * Upsert flow:
 *   1) Create/Update user (organization/manager flat IDs, roles hariç)
 *   2) Saved user'ın id'si üzerinden UpdateAppUserRoles ile rolleri senkronla
 *   3) Detail cache'ini güncelle, list'i invalide et
 *
 * Backend command roller dahil değil — ayrı endpoint kullanılıyor. Tek mutation
 * altında atomic olmaması kabul ediliyor (rollback gerekirse iki çağrı uyuşmaz);
 * pratikte UI tek POST'tan sonra rolleri yazar.
 */
export function useUpsertAppUser() {
  const queryClient = useQueryClient();

  return useMutation<AppUserDetailItem, AppError, AppUserFormValues>({
    mutationFn: async (values) => {
      try {
        const isNew = !values.id || values.id === '';
        const saved = isNew
          ? await appUserDataSource.create(values)
          : await appUserDataSource.update(values);

        await appUserDataSource.updateRoles(
          saved.id,
          values.roles.map((r) => r.id),
        );

        return await appUserDataSource.get(saved.id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: appUserKeys.lists() });
      queryClient.setQueryData(appUserKeys.detail(saved.id), saved);
    },
  });
}

export function useDeleteAppUser() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (id) => {
      try {
        await appUserDataSource.delete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appUserKeys.all });
    },
  });
}

export function useUpdateAppUserRoles() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, { userId: string; roleIds: string[] }>({
    mutationFn: async ({ userId, roleIds }) => {
      try {
        await appUserDataSource.updateRoles(userId, roleIds);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: appUserKeys.detail(variables.userId) });
    },
  });
}

export function useChangeAppUserPassword() {
  return useMutation<
    void,
    AppError,
    { userId: string; currentPassword: string; newPassword: string }
  >({
    mutationFn: async ({ userId, currentPassword, newPassword }) => {
      try {
        await appUserDataSource.changePassword(userId, currentPassword, newPassword);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
  });
}
