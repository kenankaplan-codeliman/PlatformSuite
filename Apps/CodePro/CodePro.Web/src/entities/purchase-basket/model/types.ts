export type PurchaseBasketStatus = 'Preparing' | 'Submitted' | 'Cancelled';

export interface PurchaseBasketLineItem {
  id: string;
  productId: string;
  productCode?: string | null;
  productName?: string | null;
  quantity: number;
}

export interface PurchaseBasketDetailItem {
  id: string;
  status: PurchaseBasketStatus;
  purchaseRequestId?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  lines: PurchaseBasketLineItem[];
}

export interface PurchaseBasketListItem {
  id: string;
  status: PurchaseBasketStatus;
  purchaseRequestId?: string | null;
  lineCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface PurchaseBasketListFilter {
  status?: PurchaseBasketStatus;
  isActive?: boolean;
}

export interface PurchaseBasketFormValues {
  id: string;
  status: PurchaseBasketStatus;
  purchaseRequestId?: string | null;
  lines: PurchaseBasketLineItem[];
}
