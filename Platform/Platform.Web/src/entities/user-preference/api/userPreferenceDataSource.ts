import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import type { UserPreferenceItem } from '../model/types';

export const userPreferenceDataSource = {
  get: async (key: string): Promise<UserPreferenceItem> => {
    const response = await httpClient.post<UserPreferenceItem>(ServicePath.Preference.Get, { key });
    return response.data;
  },

  save: async (key: string, value: string): Promise<UserPreferenceItem> => {
    const response = await httpClient.post<UserPreferenceItem>(ServicePath.Preference.Save, {
      key,
      value,
    });
    return response.data;
  },
};
