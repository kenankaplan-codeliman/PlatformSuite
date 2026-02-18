import apiClient from "@/services/api.client";
import { ServicePath } from '@/config/service.paths';

/* ===== TYPES ===== */

export type FraudSearchRequest = {
  keyword: string;
};

export type FraudSearchResponse = {
  items: Record<string, string>;
};

/* ===== SERVICE ===== */

export function useSearchService() {

  const searchFraud = (payload: FraudSearchRequest) => {
    return apiClient.post<FraudSearchResponse>(
      ServicePath.Lead.List,
      payload
    );
  };

  return {
    searchFraud
  };
}
