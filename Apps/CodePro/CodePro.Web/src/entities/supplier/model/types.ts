/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/Suppliers/Dtos/**
 *
 * supplierType / supplierStatus / companyType / companyLegalType GeneralParameter'a
 * taşındı — düz string code olarak tutulur. Geçerli değerler
 * `useGeneralParameters('SupplierType' | 'SupplierStatus' | 'CompanyType' | 'CompanyLegalType')`
 * ile çekilir.
 */

export interface SupplierDetailItem {
  id: string;
  name: string;
  industry?: string | null;
  website?: string | null;
  description?: string | null;
  annualRevenue?: number | null;
  numberOfEmployees?: number | null;

  supplierType: string;
  supplierStatus: string;
  companyType: string;
  companyLegalType?: string | null;
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
  supplierType: string;
  supplierStatus: string;
  companyType: string;
  vkn?: string | null;
  contactPersonEmail?: string | null;
  contactPersonPhone?: string | null;
  city?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface SupplierListFilter {
  search?: string;
  supplierType?: string;
  supplierStatus?: string;
  companyType?: string;
  isActive?: boolean;
}

export type SupplierFormValues = Omit<SupplierDetailItem, 'createdAt' | 'updatedAt'>;
