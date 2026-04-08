import axios, { AxiosHeaders } from "axios";
import { useAuthState } from "@/stores/auth.store";

const apiClient = axios.create({
  timeout: 30000,
  headers: { "Content-Type": "application/json" }
});

// Sadece token ekler — retry/refresh mantığı apiRequest'te
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthState.getState();
  if (accessToken) {
    if (!config.headers) config.headers = new AxiosHeaders();
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

export default apiClient;
