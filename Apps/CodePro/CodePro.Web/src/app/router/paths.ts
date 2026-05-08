import {
  RoutePaths as PlatformRoutePaths,
  RoutePatterns as PlatformRoutePatterns,
} from '@platform/ui';

/**
 * CodePro RoutePaths — Platform paths spread + CodePro aggregate yolları.
 */
export const RoutePaths = {
  ...PlatformRoutePaths,

  // Supplier
  SuppliersList: '/suppliers',
  SupplierNew: '/suppliers/new',
  SupplierView: (id: string) => `/suppliers/${id}`,
  SupplierEdit: (id: string) => `/suppliers/${id}/edit`,

  // Brand
  BrandsList: '/brands',
  BrandNew: '/brands/new',
  BrandView: (id: string) => `/brands/${id}`,
  BrandEdit: (id: string) => `/brands/${id}/edit`,

  // Manufacturer
  ManufacturersList: '/manufacturers',
  ManufacturerNew: '/manufacturers/new',
  ManufacturerView: (id: string) => `/manufacturers/${id}`,
  ManufacturerEdit: (id: string) => `/manufacturers/${id}/edit`,

  // ProductCategory
  ProductCategoriesList: '/product-categories',
  ProductCategoryNew: '/product-categories/new',
  ProductCategoryView: (id: string) => `/product-categories/${id}`,
  ProductCategoryEdit: (id: string) => `/product-categories/${id}/edit`,

  // BudgetCategory
  BudgetCategoriesList: '/budget-categories',
  BudgetCategoryNew: '/budget-categories/new',
  BudgetCategoryView: (id: string) => `/budget-categories/${id}`,
  BudgetCategoryEdit: (id: string) => `/budget-categories/${id}/edit`,

  // Questionnaire
  QuestionnairesList: '/questionnaires',
  QuestionnaireNew: '/questionnaires/new',
  QuestionnaireView: (id: string) => `/questionnaires/${id}`,
  QuestionnaireEdit: (id: string) => `/questionnaires/${id}/edit`,

  // PriceList
  PriceListsList: '/price-lists',
  PriceListNew: '/price-lists/new',
  PriceListView: (id: string) => `/price-lists/${id}`,
  PriceListEdit: (id: string) => `/price-lists/${id}/edit`,

  // Product
  ProductsList: '/products',
  ProductNew: '/products/new',
  ProductView: (id: string) => `/products/${id}`,
  ProductEdit: (id: string) => `/products/${id}/edit`,

  // ProductPrice
  ProductPricesList: '/product-prices',
  ProductPriceNew: '/product-prices/new',
  ProductPriceView: (id: string) => `/product-prices/${id}`,
  ProductPriceEdit: (id: string) => `/product-prices/${id}/edit`,

  // ProductCatalog
  ProductCatalogsList: '/product-catalogs',
  ProductCatalogNew: '/product-catalogs/new',
  ProductCatalogView: (id: string) => `/product-catalogs/${id}`,
  ProductCatalogEdit: (id: string) => `/product-catalogs/${id}/edit`,

  // PurchaseRequest
  PurchaseRequestsList: '/purchase-requests',
  PurchaseRequestNew: '/purchase-requests/new',
  PurchaseRequestView: (id: string) => `/purchase-requests/${id}`,
  PurchaseRequestEdit: (id: string) => `/purchase-requests/${id}/edit`,

  // PurchaseBasket
  PurchaseBasketsList: '/purchase-baskets',
  PurchaseBasketNew: '/purchase-baskets/new',
  PurchaseBasketView: (id: string) => `/purchase-baskets/${id}`,
  PurchaseBasketEdit: (id: string) => `/purchase-baskets/${id}/edit`,

  // PurchaseOrder
  PurchaseOrdersList: '/purchase-orders',
  PurchaseOrderNew: '/purchase-orders/new',
  PurchaseOrderView: (id: string) => `/purchase-orders/${id}`,
  PurchaseOrderEdit: (id: string) => `/purchase-orders/${id}/edit`,

  // Offer
  OffersList: '/offers',
  OfferNew: '/offers/new',
  OfferView: (id: string) => `/offers/${id}`,
  OfferEdit: (id: string) => `/offers/${id}/edit`,

  // Contract
  ContractsList: '/contracts',
  ContractNew: '/contracts/new',
  ContractView: (id: string) => `/contracts/${id}`,
  ContractEdit: (id: string) => `/contracts/${id}/edit`,

  // Budget
  BudgetsList: '/budgets',
  BudgetNew: '/budgets/new',
  BudgetView: (id: string) => `/budgets/${id}`,
  BudgetEdit: (id: string) => `/budgets/${id}/edit`,

  // EDocument
  EDocumentsList: '/edocuments',
  EDocumentNew: '/edocuments/new',
  EDocumentView: (id: string) => `/edocuments/${id}`,
  EDocumentEdit: (id: string) => `/edocuments/${id}/edit`,
} as const;

export const RoutePatterns = {
  ...PlatformRoutePatterns,

  SuppliersList: '/suppliers',
  SupplierNew: '/suppliers/new',
  SupplierView: '/suppliers/:id',
  SupplierEdit: '/suppliers/:id/edit',

  BrandsList: '/brands',
  BrandNew: '/brands/new',
  BrandView: '/brands/:id',
  BrandEdit: '/brands/:id/edit',

  ManufacturersList: '/manufacturers',
  ManufacturerNew: '/manufacturers/new',
  ManufacturerView: '/manufacturers/:id',
  ManufacturerEdit: '/manufacturers/:id/edit',

  ProductCategoriesList: '/product-categories',
  ProductCategoryNew: '/product-categories/new',
  ProductCategoryView: '/product-categories/:id',
  ProductCategoryEdit: '/product-categories/:id/edit',

  BudgetCategoriesList: '/budget-categories',
  BudgetCategoryNew: '/budget-categories/new',
  BudgetCategoryView: '/budget-categories/:id',
  BudgetCategoryEdit: '/budget-categories/:id/edit',

  QuestionnairesList: '/questionnaires',
  QuestionnaireNew: '/questionnaires/new',
  QuestionnaireView: '/questionnaires/:id',
  QuestionnaireEdit: '/questionnaires/:id/edit',

  PriceListsList: '/price-lists',
  PriceListNew: '/price-lists/new',
  PriceListView: '/price-lists/:id',
  PriceListEdit: '/price-lists/:id/edit',

  ProductsList: '/products',
  ProductNew: '/products/new',
  ProductView: '/products/:id',
  ProductEdit: '/products/:id/edit',

  ProductPricesList: '/product-prices',
  ProductPriceNew: '/product-prices/new',
  ProductPriceView: '/product-prices/:id',
  ProductPriceEdit: '/product-prices/:id/edit',

  ProductCatalogsList: '/product-catalogs',
  ProductCatalogNew: '/product-catalogs/new',
  ProductCatalogView: '/product-catalogs/:id',
  ProductCatalogEdit: '/product-catalogs/:id/edit',

  PurchaseRequestsList: '/purchase-requests',
  PurchaseRequestNew: '/purchase-requests/new',
  PurchaseRequestView: '/purchase-requests/:id',
  PurchaseRequestEdit: '/purchase-requests/:id/edit',

  PurchaseBasketsList: '/purchase-baskets',
  PurchaseBasketNew: '/purchase-baskets/new',
  PurchaseBasketView: '/purchase-baskets/:id',
  PurchaseBasketEdit: '/purchase-baskets/:id/edit',

  PurchaseOrdersList: '/purchase-orders',
  PurchaseOrderNew: '/purchase-orders/new',
  PurchaseOrderView: '/purchase-orders/:id',
  PurchaseOrderEdit: '/purchase-orders/:id/edit',

  OffersList: '/offers',
  OfferNew: '/offers/new',
  OfferView: '/offers/:id',
  OfferEdit: '/offers/:id/edit',

  ContractsList: '/contracts',
  ContractNew: '/contracts/new',
  ContractView: '/contracts/:id',
  ContractEdit: '/contracts/:id/edit',

  BudgetsList: '/budgets',
  BudgetNew: '/budgets/new',
  BudgetView: '/budgets/:id',
  BudgetEdit: '/budgets/:id/edit',

  EDocumentsList: '/edocuments',
  EDocumentNew: '/edocuments/new',
  EDocumentView: '/edocuments/:id',
  EDocumentEdit: '/edocuments/:id/edit',
} as const;
