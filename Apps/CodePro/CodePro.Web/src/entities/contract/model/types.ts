export type ContractType = 'Sales' | 'Purchase' | 'Service' | 'Nda' | 'Framework' | 'Other';
export type ContractStatus =
  | 'Draft' | 'PendingInternalApproval' | 'InternallyApproved' | 'Sent' | 'Signed' | 'Active'
  | 'Expired' | 'Cancelled' | 'Terminated';
export type ContractRenewalType = 'None' | 'Manual' | 'AutoRenew';
export type ContractCurrency = 'TRY' | 'USD' | 'EUR';
export type ContractPaymentType = 'OneTime' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom';

export interface ContractDetailItem {
  id: string;
  contractNumber: string;
  subject: string;
  type: ContractType;
  counterpartyName: string;
  counterpartyId?: string | null;
  relatedOfferId?: string | null;
  startDate: string;
  endDate?: string | null;
  renewalType: ContractRenewalType;
  amount?: number | null;
  currency?: ContractCurrency | null;
  paymentType?: ContractPaymentType | null;
  responsibleUserId: string;
  additionalResponsibleUserIds?: string | null;
  reminderDaysBefore: number;
  notes?: string | null;
  status: ContractStatus;
  sentToCounterpartyAt?: string | null;
  signedAt?: string | null;
  lastReminderSentAt?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ContractListItem {
  id: string;
  contractNumber: string;
  subject: string;
  type: ContractType;
  counterpartyName: string;
  status: ContractStatus;
  startDate: string;
  endDate?: string | null;
  amount?: number | null;
  currency?: ContractCurrency | null;
  isActive: boolean;
}

export interface ContractListFilter {
  search?: string;
  type?: ContractType;
  status?: ContractStatus;
  isActive?: boolean;
}

export interface ContractFormValues {
  id: string;
  contractNumber: string;
  subject: string;
  type: ContractType;
  counterpartyName: string;
  counterpartyId?: string | null;
  relatedOfferId?: string | null;
  startDate: string;
  endDate?: string | null;
  renewalType: ContractRenewalType;
  amount?: number | null;
  currency?: ContractCurrency | null;
  paymentType?: ContractPaymentType | null;
  responsibleUserId: string;
  additionalResponsibleUserIds?: string | null;
  reminderDaysBefore: number;
  notes?: string | null;
  status: ContractStatus;
}
