/**
 * CodePro uygulamasına özgü servis yolları — CodePro.Api Controller route'ları ile birebir.
 * Platform endpoint'leri @platform/ui ServicePath'ten gelir; CodePro kendi sayfaları için extend eder.
 */
const ApiBase = '/api';

const ControllerPaths = {
  Supplier: `${ApiBase}/supplier`,
  Brand: `${ApiBase}/brand`,
  Manufacturer: `${ApiBase}/manufacturer`,
  ProductCategory: `${ApiBase}/product-category`,
  BudgetCategory: `${ApiBase}/budget-category`,
  Questionnaire: `${ApiBase}/questionnaire`,
  PriceList: `${ApiBase}/price-list`,
  Product: `${ApiBase}/product`,
  ProductPrice: `${ApiBase}/product-price`,
  ProductCatalog: `${ApiBase}/product-catalog`,
  PurchaseRequest: `${ApiBase}/purchase-request`,
  PurchaseBasket: `${ApiBase}/purchase-basket`,
  PurchaseOrder: `${ApiBase}/purchase-order`,
  Offer: `${ApiBase}/offer`,
  Contract: `${ApiBase}/contract`,
  Budget: `${ApiBase}/budget`,
  EDocument: `${ApiBase}/edocument`,
} as const;

const crud = (base: string) => ({
  List: `${base}/list`,
  Get: `${base}/get`,
  Create: `${base}/create`,
  Update: `${base}/update`,
  Delete: `${base}/delete`,
});

const crudWithSearch = (base: string) => ({
  ...crud(base),
  Search: `${base}/search`,
});

export const CodeProServicePath = {
  Supplier: crud(ControllerPaths.Supplier),
  Brand: crud(ControllerPaths.Brand),
  Manufacturer: crud(ControllerPaths.Manufacturer),
  ProductCategory: crudWithSearch(ControllerPaths.ProductCategory),
  BudgetCategory: crud(ControllerPaths.BudgetCategory),
  Questionnaire: crud(ControllerPaths.Questionnaire),
  PriceList: crudWithSearch(ControllerPaths.PriceList),
  Product: {
    ...crudWithSearch(ControllerPaths.Product),
    ImageList: `${ControllerPaths.Product}/image/list`,
    ImageUpload: `${ControllerPaths.Product}/image/upload`,
    ImageDelete: `${ControllerPaths.Product}/image/delete`,
    ImageReorder: `${ControllerPaths.Product}/image/reorder`,
    ImageSetDefault: `${ControllerPaths.Product}/image/set-default`,
    ImageThumbnail: `${ControllerPaths.Product}/image/thumbnail`,
    ImageDownload: `${ControllerPaths.Product}/image/download`,
  },
  ProductPrice: crud(ControllerPaths.ProductPrice),
  ProductCatalog: crud(ControllerPaths.ProductCatalog),
  PurchaseRequest: crud(ControllerPaths.PurchaseRequest),
  PurchaseBasket: crud(ControllerPaths.PurchaseBasket),
  PurchaseOrder: crud(ControllerPaths.PurchaseOrder),
  Offer: crud(ControllerPaths.Offer),
  Contract: crud(ControllerPaths.Contract),
  Budget: crud(ControllerPaths.Budget),
  EDocument: crud(ControllerPaths.EDocument),
} as const;
