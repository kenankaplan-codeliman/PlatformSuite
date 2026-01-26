import apiClient from "@/services/api.client";
import { EndPointPaths } from '@/constants/endpoint.paths';

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
      EndPointPaths.Lead.List,
      payload
    );
  };

  return {
    searchFraud
  };
}
