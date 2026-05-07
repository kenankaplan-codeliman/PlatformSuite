/**
 * Backend DTO'su ile birebir uyumlu — CodePro.Application/Features/ProductImages/Dtos/ProductImageItem.
 */

export interface ProductImageItem {
  id: string;
  productId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  sortOrder: number;
  isDefault: boolean;
  createdAt: string;
  createdBy: string;
}

export interface UploadProductImageInput {
  productId: string;
  file: File;
  sortOrder?: number;
}

export interface ReorderProductImagesInput {
  productId: string;
  imageIds: string[];
}

export interface SetDefaultProductImageInput {
  productId: string;
  imageId: string;
}
