import type { EntityReference } from '@platform/ui';

export type PurchaseOrderStatus =
  | 'Draft' | 'Sent' | 'Acknowledged' | 'PartialDelivered' | 'Delivered' | 'Cancelled' | 'Closed';
export type PurchaseOrderPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type PurchaseOrderLineStatus = 'Draft' | 'Sent' | 'Acknowledged' | 'PartialDelivered' | 'Delivered' | 'Cancelled';

export interface PurchaseOrderLineItem {
  id: string;
  purchaseRequestLineId?: string | null;
  isFreeProduct: boolean;
  productId?: string | null;
  productName?: string | null;
  quantity: number;
  unitOfMeasure?: string | null;
  unitPrice?: number | null;
  currency?: string | null;
  totalAmount: number;
  needByDate?: string | null;
  buyerNotes?: string | null;
  status: PurchaseOrderLineStatus;
}

export interface PurchaseOrderDetailItem {
  id: string;
  orderNumber: string;
  title: string;
  description?: string | null;
  supplierAccount?: EntityReference | null;
  purchaseRequestId?: string | null;
  status: PurchaseOrderStatus;
  priority: PurchaseOrderPriority;
  orderDate: string;
  expectedDeliveryDate?: string | null;
  currencyCode?: string | null;
  totalAmount: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  lines: PurchaseOrderLineItem[];
}

export interface PurchaseOrderListItem {
  id: string;
  orderNumber: string;
  title: string;
  supplierAccountId: string;
  supplierAccountName?: string | null;
  status: PurchaseOrderStatus;
  priority: PurchaseOrderPriority;
  orderDate: string;
  totalAmount: number;
  currencyCode?: string | null;
  lineCount: number;
  isActive: boolean;
}

export interface PurchaseOrderListFilter {
  search?: string;
  status?: PurchaseOrderStatus;
  priority?: PurchaseOrderPriority;
  supplierAccountId?: string;
  isActive?: boolean;
}

export interface PurchaseOrderFormValues {
  id: string;
  orderNumber: string;
  title: string;
  description?: string | null;
  supplierAccount?: EntityReference | null;
  purchaseRequestId?: string | null;
  status: PurchaseOrderStatus;
  priority: PurchaseOrderPriority;
  orderDate: string;
  expectedDeliveryDate?: string | null;
  currencyCode?: string | null;
  lines: PurchaseOrderLineItem[];
}
