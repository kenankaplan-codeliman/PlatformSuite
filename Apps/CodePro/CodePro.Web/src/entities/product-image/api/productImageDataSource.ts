import { httpClient } from '@platform/ui';
import { CodeProServicePath } from '../../../shared/api/servicePaths';
import type {
  ProductImageItem,
  ReorderProductImagesInput,
  SetDefaultProductImageInput,
  UploadProductImageInput,
} from '../model/types';

interface IdBody {
  id: string;
}

interface ProductIdBody {
  id: string;
}

export const productImageDataSource = {
  list: async (productId: string): Promise<ProductImageItem[]> => {
    const response = await httpClient.post<ProductImageItem[]>(
      CodeProServicePath.Product.ImageList,
      { id: productId } satisfies ProductIdBody,
    );
    return response.data;
  },

  upload: async (input: UploadProductImageInput): Promise<ProductImageItem> => {
    const formData = new FormData();
    formData.append('file', input.file);
    formData.append('productId', input.productId);
    formData.append('sortOrder', String(input.sortOrder ?? 0));

    const response = await httpClient.post<ProductImageItem>(
      CodeProServicePath.Product.ImageUpload,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(CodeProServicePath.Product.ImageDelete, { id } satisfies IdBody);
  },

  reorder: async (input: ReorderProductImagesInput): Promise<void> => {
    await httpClient.post(CodeProServicePath.Product.ImageReorder, input);
  },

  setDefault: async (input: SetDefaultProductImageInput): Promise<void> => {
    await httpClient.post(CodeProServicePath.Product.ImageSetDefault, input);
  },

  getThumbnailObjectUrl: async (id: string): Promise<string> => {
    const response = await httpClient.post(
      CodeProServicePath.Product.ImageThumbnail,
      { id } satisfies IdBody,
      { responseType: 'blob' },
    );
    return URL.createObjectURL(new Blob([response.data]));
  },

  getOriginalObjectUrl: async (id: string): Promise<string> => {
    const response = await httpClient.post(
      CodeProServicePath.Product.ImageDownload,
      { id } satisfies IdBody,
      { responseType: 'blob' },
    );
    return URL.createObjectURL(new Blob([response.data]));
  },
};
