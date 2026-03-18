import apiClient from '@/services/api.client';
import { apiRequest } from '@/services/api.request';
import { ServicePath } from '@/config/service.paths';
import type { AuditInfo, AuditRequest } from '@/types/common.types';

export const auditService = {
  getAuditInfo: async (request: AuditRequest): Promise<AuditInfo> => {
    return apiRequest(() =>
      apiClient.post<AuditInfo>(ServicePath.Audit.Get, request).then(r => r.data)
    );
  },
};

export default auditService;