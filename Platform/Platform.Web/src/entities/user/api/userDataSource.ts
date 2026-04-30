import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import type { ClientUserInfo } from '../model/types';

export const userDataSource = {
  me: async (): Promise<ClientUserInfo> => {
    const response = await httpClient.post<ClientUserInfo>(ServicePath.Auth.Me);
    return response.data;
  },
};
