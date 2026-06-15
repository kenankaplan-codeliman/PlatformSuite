import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import type {
  AssistantChatRequest,
  AssistantChatResponse,
  ConfirmActionResponse,
} from '../model/types';

export const assistantDataSource = {
  chat: async (request: AssistantChatRequest): Promise<AssistantChatResponse> => {
    // Asistan turu vision + araç çağrıları içerebilir; global 30s timeout yetmeyebilir.
    const response = await httpClient.post<AssistantChatResponse>(
      ServicePath.Assistant.Chat,
      request,
      { timeout: 120_000 },
    );
    return response.data;
  },

  /** Kullanıcının onayladığı yazma işlemini imzalı token ile çalıştırır. */
  confirm: async (token: string): Promise<ConfirmActionResponse> => {
    const response = await httpClient.post<ConfirmActionResponse>(
      ServicePath.Assistant.Confirm,
      { token },
      { timeout: 120_000 },
    );
    return response.data;
  },
};
