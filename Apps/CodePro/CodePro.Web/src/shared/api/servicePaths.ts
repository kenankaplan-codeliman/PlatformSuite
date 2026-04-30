/**
 * CodePro uygulamasına özgü servis yolları — CodePro.Api Controller route'ları ile birebir.
 * Platform endpoint'leri @platform/ui ServicePath'ten gelir; CodePro kendi sayfaları için extend eder.
 */
const ApiBase = '/api';

const ControllerPaths = {
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

export const CodeProServicePath = {
  Brand: crud(ControllerPaths.Brand),
  Manufacturer: crud(ControllerPaths.Manufacturer),
  ProductCategory: crud(ControllerPaths.ProductCategory),
  BudgetCategory: crud(ControllerPaths.BudgetCategory),
  Questionnaire: crud(ControllerPaths.Questionnaire),
  PriceList: crud(ControllerPaths.PriceList),
  Product: crud(ControllerPaths.Product),
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
