import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from '@/config/apiConfig';

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
      API_ENDPOINTS.LEAD.BASE,
      payload
    );
  };

  return {
    searchFraud
  };
}
