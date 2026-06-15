import type { EntityReference } from '../../../shared/types/EntityReference';

/** Backend ile taşınan basit sohbet turu (stateless geçmiş). */
export interface AssistantTurn {
  role: 'user' | 'assistant';
  text: string;
}

/** UI'da gösterilen mesaj — asistan mesajları kayıt linkleri taşıyabilir. */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  links?: EntityReference[];
  isError?: boolean;
}

export interface AssistantChatRequest {
  message: string;
  attachmentId?: string | null;
  history: AssistantTurn[];
}

/** Kullanıcı onayı bekleyen yazma işlemi (token backend'de imzalı). */
export interface PendingAction {
  token: string;
  toolName: string;
  summary: string;
}

export interface AssistantChatResponse {
  reply: string;
  links: EntityReference[];
  history: AssistantTurn[];
  pendingActions: PendingAction[];
}

export interface ConfirmActionResponse {
  reply: string;
  links: EntityReference[];
  isError: boolean;
}

/**
 * entityType + id → uygulama route'u. Route bilgisi app'e özeldir (CRM kendi map'ini geçer),
 * böylece Platform.Web cross-app route bilmez. undefined dönerse link düz metin gösterilir.
 */
export type ResolveLink = (entityType: string, id: string) => string | undefined;
