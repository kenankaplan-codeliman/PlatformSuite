import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activityDataSource } from './activityDataSource';
import { activityKeys } from '../../../shared/api/queryKeys';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import type { AppError } from '../../../shared/types/ApiError';
import type {
  ActivityDetailItem,
  ActivityFormValues,
  ActivityType,
} from '../model/types';

/**
 * Türü çağıran karar verir; create/update toggle'ı `id` boşluğuna göre
 * datasource'da yapılır.
 */
export function useUpsertActivity() {
  const queryClient = useQueryClient();

  return useMutation<ActivityDetailItem, AppError, ActivityFormValues>({
    mutationFn: async (values) => {
      try {
        switch (values.activityType) {
          case 'PhoneCall':
            return await activityDataSource.upsertPhoneCall(values);
          case 'Task':
            return await activityDataSource.upsertTask(values);
          case 'Appointment':
            return await activityDataSource.upsertAppointment(values);
          case 'Email':
            return await activityDataSource.upsertEmail(values);
        }
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      queryClient.setQueryData(
        activityKeys.detail(saved.activityType, saved.id),
        saved,
      );
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string[]>({
    mutationFn: async (ids) => {
      try {
        await activityDataSource.deleteMany(ids);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useCompleteActivity() {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, { id: string; type: ActivityType }>({
    mutationFn: async ({ id }) => {
      try {
        await activityDataSource.complete(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (_v, { type, id }) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(type, id) });
    },
  });
}

export function useCancelActivity() {
  const queryClient = useQueryClient();
  return useMutation<void, AppError, { id: string; type: ActivityType }>({
    mutationFn: async ({ id }) => {
      try {
        await activityDataSource.cancel(id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (_v, { type, id }) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(type, id) });
    },
  });
}
