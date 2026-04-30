/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/Manufacturers/Dtos/**
 */

export interface ManufacturerDetailItem {
  id: string;
  name: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ManufacturerListItem {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface ManufacturerListFilter {
  search?: string;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type ManufacturerFormValues = Omit<ManufacturerDetailItem, 'createdAt' | 'updatedAt'>;
