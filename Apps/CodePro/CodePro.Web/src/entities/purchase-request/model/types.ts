export type PurchaseRequestStatus =
  | 'Setup'
  | 'PendingApproval'
  | 'InPurchasing'
  | 'PartialOrderCreated'
  | 'OrderCreated'
  | 'Rejected'
  | 'Completed'
  | 'Cancelled';

export type PurchaseRequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type PurchaseRequestLineStatus = 'Setup' | 'Approved' | 'Rejected' | 'Ordered' | 'Cancelled';

export interface PurchaseRequestLineItem {
  id: string;
  isFreeProduct: boolean;
  productId?: string | null;
  productName?: string | null;
  supplierAccountId?: string | null;
  supplierAccountName?: string | null;
  quantity: number;
  unitOfMeasure?: string | null;
  unitPrice?: number | null;
  currency?: string | null;
  totalAmount: number;
  needByDate?: string | null;
  buyerNotes?: string | null;
  status: PurchaseRequestLineStatus;
}

export interface PurchaseRequestDetailItem {
  id: string;
  requestNumber: string;
  title: string;
  description?: string | null;
  status: PurchaseRequestStatus;
  priority: PurchaseRequestPriority;
  requestDate: string;
  requiredDate?: string | null;
  currencyCode?: string | null;
  totalAmount: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  lines: PurchaseRequestLineItem[];
}

export interface PurchaseRequestListItem {
  id: string;
  requestNumber: string;
  title: string;
  status: PurchaseRequestStatus;
  priority: PurchaseRequestPriority;
  requestDate: string;
  requiredDate?: string | null;
  totalAmount: number;
  currencyCode?: string | null;
  lineCount: number;
  isActive: boolean;
}

export interface PurchaseRequestListFilter {
  search?: string;
  status?: PurchaseRequestStatus;
  priority?: PurchaseRequestPriority;
  isActive?: boolean;
}

export interface PurchaseRequestFormValues {
  id: string;
  requestNumber: string;
  title: string;
  description?: string | null;
  status: PurchaseRequestStatus;
  priority: PurchaseRequestPriority;
  requestDate: string;
  requiredDate?: string | null;
  currencyCode?: string | null;
  lines: PurchaseRequestLineItem[];
}
