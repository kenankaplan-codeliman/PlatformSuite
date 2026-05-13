import i18n from 'i18next';

import supplierEntityTr from '../entities/supplier/locales/tr.json';
import suppliersListTr from '../pages/suppliers/list/locales/tr.json';
import suppliersDetailTr from '../pages/suppliers/detail/locales/tr.json';
import brandEntityTr from '../entities/brand/locales/tr.json';
import brandsListTr from '../pages/brands/list/locales/tr.json';
import brandsDetailTr from '../pages/brands/detail/locales/tr.json';
import manufacturerEntityTr from '../entities/manufacturer/locales/tr.json';
import manufacturersListTr from '../pages/manufacturers/list/locales/tr.json';
import manufacturersDetailTr from '../pages/manufacturers/detail/locales/tr.json';
import productCategoryEntityTr from '../entities/product-category/locales/tr.json';
import productCategoriesListTr from '../pages/product-categories/list/locales/tr.json';
import productCategoriesDetailTr from '../pages/product-categories/detail/locales/tr.json';
import budgetCategoryEntityTr from '../entities/budget-category/locales/tr.json';
import budgetCategoriesListTr from '../pages/budget-categories/list/locales/tr.json';
import budgetCategoriesDetailTr from '../pages/budget-categories/detail/locales/tr.json';
import questionnaireEntityTr from '../entities/questionnaire/locales/tr.json';
import questionnairesListTr from '../pages/questionnaires/list/locales/tr.json';
import questionnairesDetailTr from '../pages/questionnaires/detail/locales/tr.json';
import priceListEntityTr from '../entities/price-list/locales/tr.json';
import priceListsListTr from '../pages/price-lists/list/locales/tr.json';
import priceListsDetailTr from '../pages/price-lists/detail/locales/tr.json';
import productEntityTr from '../entities/product/locales/tr.json';
import productImageEntityTr from '../entities/product-image/locales/tr.json';
import productsListTr from '../pages/products/list/locales/tr.json';
import productsDetailTr from '../pages/products/detail/locales/tr.json';
import productPriceEntityTr from '../entities/product-price/locales/tr.json';
import productPricesListTr from '../pages/product-prices/list/locales/tr.json';
import productPricesDetailTr from '../pages/product-prices/detail/locales/tr.json';
import productCatalogEntityTr from '../entities/product-catalog/locales/tr.json';
import productCatalogsListTr from '../pages/product-catalogs/list/locales/tr.json';
import productCatalogsDetailTr from '../pages/product-catalogs/detail/locales/tr.json';
import purchaseRequestEntityTr from '../entities/purchase-request/locales/tr.json';
import purchaseRequestsListTr from '../pages/purchase-requests/list/locales/tr.json';
import purchaseRequestsDetailTr from '../pages/purchase-requests/detail/locales/tr.json';
import purchaseBasketEntityTr from '../entities/purchase-basket/locales/tr.json';
import purchaseBasketsListTr from '../pages/purchase-baskets/list/locales/tr.json';
import purchaseBasketsDetailTr from '../pages/purchase-baskets/detail/locales/tr.json';
import purchaseOrderEntityTr from '../entities/purchase-order/locales/tr.json';
import purchaseOrdersListTr from '../pages/purchase-orders/list/locales/tr.json';
import purchaseOrdersDetailTr from '../pages/purchase-orders/detail/locales/tr.json';
import offerEntityTr from '../entities/offer/locales/tr.json';
import offersListTr from '../pages/offers/list/locales/tr.json';
import offersDetailTr from '../pages/offers/detail/locales/tr.json';
import contractEntityTr from '../entities/contract/locales/tr.json';
import contractsListTr from '../pages/contracts/list/locales/tr.json';
import contractsDetailTr from '../pages/contracts/detail/locales/tr.json';
import budgetEntityTr from '../entities/budget/locales/tr.json';
import budgetsListTr from '../pages/budgets/list/locales/tr.json';
import budgetsDetailTr from '../pages/budgets/detail/locales/tr.json';
import eDocumentEntityTr from '../entities/edocument/locales/tr.json';
import eDocumentsListTr from '../pages/edocuments/list/locales/tr.json';
import eDocumentsDetailTr from '../pages/edocuments/detail/locales/tr.json';
import codeProEnumsTr from '../shared/locales/enums/tr.json';
import codeProMenuTr from './menu/locales/tr.json';
import codeProAppTr from './locales/tr.json';

/**
 * Platform i18n init'i tamamlandıktan sonra çağrılır. CodePro-spesifik
 * namespace'leri ekler; `enums` namespace'ini deep-merge ile genişletir.
 */
export function registerCodeProTranslations(): void {
  i18n.addResourceBundle('tr', 'entity.supplier', supplierEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.suppliers-list', suppliersListTr, true, true);
  i18n.addResourceBundle('tr', 'page.suppliers-detail', suppliersDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.brand', brandEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.brands-list', brandsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.brands-detail', brandsDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.manufacturer', manufacturerEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.manufacturers-list', manufacturersListTr, true, true);
  i18n.addResourceBundle('tr', 'page.manufacturers-detail', manufacturersDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.product-category', productCategoryEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.product-categories-list', productCategoriesListTr, true, true);
  i18n.addResourceBundle('tr', 'page.product-categories-detail', productCategoriesDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.budget-category', budgetCategoryEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.budget-categories-list', budgetCategoriesListTr, true, true);
  i18n.addResourceBundle('tr', 'page.budget-categories-detail', budgetCategoriesDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.questionnaire', questionnaireEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.questionnaires-list', questionnairesListTr, true, true);
  i18n.addResourceBundle('tr', 'page.questionnaires-detail', questionnairesDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.price-list', priceListEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.price-lists-list', priceListsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.price-lists-detail', priceListsDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.product', productEntityTr, true, true);
  i18n.addResourceBundle('tr', 'entity.product-image', productImageEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.products-list', productsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.products-detail', productsDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.product-price', productPriceEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.product-prices-list', productPricesListTr, true, true);
  i18n.addResourceBundle('tr', 'page.product-prices-detail', productPricesDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.product-catalog', productCatalogEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.product-catalogs-list', productCatalogsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.product-catalogs-detail', productCatalogsDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.purchase-request', purchaseRequestEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.purchase-requests-list', purchaseRequestsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.purchase-requests-detail', purchaseRequestsDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.purchase-basket', purchaseBasketEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.purchase-baskets-list', purchaseBasketsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.purchase-baskets-detail', purchaseBasketsDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.purchase-order', purchaseOrderEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.purchase-orders-list', purchaseOrdersListTr, true, true);
  i18n.addResourceBundle('tr', 'page.purchase-orders-detail', purchaseOrdersDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.offer', offerEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.offers-list', offersListTr, true, true);
  i18n.addResourceBundle('tr', 'page.offers-detail', offersDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.contract', contractEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.contracts-list', contractsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.contracts-detail', contractsDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.budget', budgetEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.budgets-list', budgetsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.budgets-detail', budgetsDetailTr, true, true);

  i18n.addResourceBundle('tr', 'entity.edocument', eDocumentEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.edocuments-list', eDocumentsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.edocuments-detail', eDocumentsDetailTr, true, true);

  // enums namespace Platform tarafından init edildi; üzerine CodePro enum'larını deep-merge et.
  i18n.addResourceBundle('tr', 'enums', codeProEnumsTr, true, false);

  i18n.addResourceBundle('tr', 'app.codepro-menu', codeProMenuTr, true, true);
  i18n.addResourceBundle('tr', 'app.codepro', codeProAppTr, true, true);
}
