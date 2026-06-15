import { useMutation } from '@tanstack/react-query';
import { assistantDataSource } from './assistantDataSource';
import type { AssistantChatRequest, AssistantChatResponse } from '../model/types';

export function useAssistantChat() {
  return useMutation<AssistantChatResponse, unknown, AssistantChatRequest>({
    mutationFn: (request) => assistantDataSource.chat(request),
  });
}
