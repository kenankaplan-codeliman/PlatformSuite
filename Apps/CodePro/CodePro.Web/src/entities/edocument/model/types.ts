export type EDocumentStatus = 'Draft' | 'Sent' | 'PartiallyApproved' | 'Approved' | 'Rejected' | 'Cancelled';

export interface EDocumentDetailItem {
  id: string;
  subject: string;
  description?: string | null;
  documentType: string;
  status: EDocumentStatus;
  entityType: string;
  entityId: string;
  attachmentUrl?: string | null;
  routingType?: string | null;
  routingGroups?: string | null;
  routingPersonIds?: string | null;
  routingPersonNames?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface EDocumentListItem {
  id: string;
  subject: string;
  documentType: string;
  status: EDocumentStatus;
  entityType: string;
  entityId: string;
  isActive: boolean;
  createdAt: string;
}

export interface EDocumentListFilter {
  search?: string;
  documentType?: string;
  status?: EDocumentStatus;
  entityType?: string;
  entityId?: string;
  isActive?: boolean;
}

export interface EDocumentFormValues {
  id: string;
  subject: string;
  description?: string | null;
  documentType: string;
  status: EDocumentStatus;
  entityType: string;
  entityId: string;
  attachmentUrl?: string | null;
  routingType?: string | null;
  routingGroups?: string | null;
  routingPersonIds?: string | null;
  routingPersonNames?: string | null;
}
