export type OfferType = 'Sales' | 'Purchase';
export type OfferStatus =
  | 'Draft' | 'PendingInternalApproval' | 'InternallyApproved' | 'PendingExternalApproval'
  | 'Sent' | 'Won' | 'Lost' | 'Cancelled' | 'Expired';
export type OfferUnit = 'Piece' | 'Kg' | 'Meter' | 'Liter' | 'Hour' | 'Day' | 'Month' | 'Year';
export type OfferVatRate = 'Zero' | 'One' | 'Ten' | 'Twenty';

export interface OfferItemItem {
  id: string;
  orderIndex: number;
  productId?: string | null;
  productName: string;
  quantity: number;
  unit: OfferUnit;
  unitPrice: number;
  vatRate: OfferVatRate;
  lineTotal: number;
  lineVat: number;
}

export interface OfferDetailItem {
  id: string;
  offerNumber: string;
  offerType: OfferType;
  subject: string;
  counterpartyName: string;
  counterpartyId?: string | null;
  responsibleUserId: string;
  validFrom?: string | null;
  validUntil: string;
  currency: string;
  discountPercentage: number;
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
  notes?: string | null;
  status: OfferStatus;
  resultReason?: string | null;
  resultReasonCategory?: string | null;
  convertedContractId?: string | null;
  sentToCounterpartyAt?: string | null;
  resultMarkedAt?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  items: OfferItemItem[];
}

export interface OfferListItem {
  id: string;
  offerNumber: string;
  offerType: OfferType;
  subject: string;
  counterpartyName: string;
  status: OfferStatus;
  validUntil: string;
  currency: string;
  grandTotal: number;
  isActive: boolean;
}

export interface OfferListFilter {
  search?: string;
  offerType?: OfferType;
  status?: OfferStatus;
  isActive?: boolean;
}

export interface OfferFormValues {
  id: string;
  offerNumber: string;
  offerType: OfferType;
  subject: string;
  counterpartyName: string;
  counterpartyId?: string | null;
  responsibleUserId: string;
  validFrom?: string | null;
  validUntil: string;
  currency: string;
  discountPercentage: number;
  notes?: string | null;
  status: OfferStatus;
  items: OfferItemItem[];
}
