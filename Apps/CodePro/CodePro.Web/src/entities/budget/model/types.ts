export type BudgetPeriodType = 'Yearly' | 'Quarterly' | 'Monthly' | 'Custom';
export type BudgetStatus = 'Draft' | 'InInternalApproval' | 'Active' | 'Depleted' | 'Expired' | 'Passive' | 'Rejected';
export type BudgetOverflowBehavior = 'Block' | 'Warn' | 'Free';
export type BudgetReleasePoint = 'RequestApproval' | 'PurchaseOrder' | 'Contract' | 'Invoice';

export interface BudgetDetailItem {
  id: string;
  name: string;
  description?: string | null;
  scopeOrganizationId?: string | null;
  scopeOrganizationName?: string | null;
  budgetCategoryId?: string | null;
  budgetCategoryName?: string | null;
  periodType: BudgetPeriodType;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  overflowBehavior: BudgetOverflowBehavior;
  reservationReleasePoint: BudgetReleasePoint;
  alertThresholdPercentage: number;
  carryOverEnabled: boolean;
  responsibleUserId: string;
  status: BudgetStatus;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface BudgetListItem {
  id: string;
  name: string;
  periodType: BudgetPeriodType;
  status: BudgetStatus;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  budgetCategoryName?: string | null;
  scopeOrganizationName?: string | null;
  isActive: boolean;
}

export interface BudgetListFilter {
  search?: string;
  status?: BudgetStatus;
  periodType?: BudgetPeriodType;
  budgetCategoryId?: string;
  isActive?: boolean;
}

export interface BudgetFormValues {
  id: string;
  name: string;
  description?: string | null;
  scopeOrganizationId?: string | null;
  budgetCategoryId?: string | null;
  periodType: BudgetPeriodType;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  overflowBehavior: BudgetOverflowBehavior;
  reservationReleasePoint: BudgetReleasePoint;
  alertThresholdPercentage: number;
  carryOverEnabled: boolean;
  responsibleUserId: string;
  status: BudgetStatus;
}
