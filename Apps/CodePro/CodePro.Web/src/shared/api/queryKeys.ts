/**
 * CodePro-spesifik TanStack Query anahtar fabrikaları — Platform queryKeys (account, organization)
 * @platform/ui'dan gelir.
 */

function makeKeys<TParams = unknown>(scope: string) {
  const all = [scope] as const;
  return {
    all,
    lists: () => [...all, 'list'] as const,
    list: (params: TParams | unknown) => [...all, 'list', params] as const,
    details: () => [...all, 'detail'] as const,
    detail: (id: string) => [...all, 'detail', id] as const,
  };
}

export const supplierKeys = makeKeys('supplier');
export const brandKeys = makeKeys('brand');
export const manufacturerKeys = makeKeys('manufacturer');
export const productCategoryKeys = makeKeys('product-category');
export const budgetCategoryKeys = makeKeys('budget-category');
export const questionnaireKeys = makeKeys('questionnaire');
export const priceListKeys = makeKeys('price-list');
export const productKeys = makeKeys('product');

export const productImageKeys = {
  all: ['product-image'] as const,
  byProduct: (productId: string) => ['product-image', 'by-product', productId] as const,
};
export const productPriceKeys = makeKeys('product-price');
export const productCatalogKeys = makeKeys('product-catalog');
export const purchaseRequestKeys = makeKeys('purchase-request');
export const purchaseBasketKeys = makeKeys('purchase-basket');
export const purchaseOrderKeys = makeKeys('purchase-order');
export const offerKeys = makeKeys('offer');
export const contractKeys = makeKeys('contract');
export const budgetKeys = makeKeys('budget');
export const eDocumentKeys = makeKeys('edocument');
