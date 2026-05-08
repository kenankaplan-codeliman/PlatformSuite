/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/Suppliers/Dtos/**
 */

export type SupplierType =
  | 'Manufacturer'
  | 'Distributor'
  | 'ServiceProvider'
  | 'Retailer'
  | 'Other';

export type SupplierStatus = 'Pending' | 'Active' | 'Passive' | 'Blacklisted';

export type CompanyType = 'Gercek' | 'Tuzel';

export type CompanyLegalType =
  | 'AnonimSirketi'
  | 'LimitedSirket'
  | 'KomanditSirket'
  | 'KolektifSirket';

export interface SupplierDetailItem {
  id: string;
  name: string;
  industry?: string | null;
  website?: string | null;
  description?: string | null;
  annualRevenue?: number | null;
  numberOfEmployees?: number | null;

  supplierType: SupplierType;
  supplierStatus: SupplierStatus;
  companyType: CompanyType;
  companyLegalType?: CompanyLegalType | null;
  taxOffice?: string | null;
  vkn?: string | null;
  mersisNo?: string | null;

  contactPersonName?: string | null;
  contactPersonEmail?: string | null;
  contactPersonPhone?: string | null;

  addressLine?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;

  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SupplierListItem {
  id: string;
  name: string;
  industry?: string | null;
  supplierType: SupplierType;
  supplierStatus: SupplierStatus;
  companyType: CompanyType;
  vkn?: string | null;
  contactPersonEmail?: string | null;
  contactPersonPhone?: string | null;
  city?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface SupplierListFilter {
  search?: string;
  supplierType?: SupplierType;
  supplierStatus?: SupplierStatus;
  companyType?: CompanyType;
  isActive?: boolean;
}

export type SupplierFormValues = Omit<SupplierDetailItem, 'createdAt' | 'updatedAt'>;
