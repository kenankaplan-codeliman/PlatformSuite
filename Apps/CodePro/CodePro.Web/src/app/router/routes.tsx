import { createBrowserRouter } from 'react-router-dom';
import {
  AccountDetailPage,
  AccountsListPage,
  AppRoleDetailPage,
  AppRolesListPage,
  AppUserDetailPage,
  AppUsersListPage,
  HomePage,
  LoginPage,
  OrganizationDetailPage,
  OrganizationsListPage,
} from '@platform/ui';
import { BrandDetailPage } from '../../pages/brands/detail/ui/BrandDetailPage';
import { BrandsListPage } from '../../pages/brands/list/ui/BrandsListPage';
import { ManufacturerDetailPage } from '../../pages/manufacturers/detail/ui/ManufacturerDetailPage';
import { ManufacturersListPage } from '../../pages/manufacturers/list/ui/ManufacturersListPage';
import { ProductCategoryDetailPage } from '../../pages/product-categories/detail/ui/ProductCategoryDetailPage';
import { ProductCategoriesListPage } from '../../pages/product-categories/list/ui/ProductCategoriesListPage';
import { BudgetCategoryDetailPage } from '../../pages/budget-categories/detail/ui/BudgetCategoryDetailPage';
import { BudgetCategoriesListPage } from '../../pages/budget-categories/list/ui/BudgetCategoriesListPage';
import { QuestionnaireDetailPage } from '../../pages/questionnaires/detail/ui/QuestionnaireDetailPage';
import { QuestionnairesListPage } from '../../pages/questionnaires/list/ui/QuestionnairesListPage';
import { PriceListDetailPage } from '../../pages/price-lists/detail/ui/PriceListDetailPage';
import { PriceListsListPage } from '../../pages/price-lists/list/ui/PriceListsListPage';
import { ProductDetailPage } from '../../pages/products/detail/ui/ProductDetailPage';
import { ProductsListPage } from '../../pages/products/list/ui/ProductsListPage';
import { ProductPriceDetailPage } from '../../pages/product-prices/detail/ui/ProductPriceDetailPage';
import { ProductPricesListPage } from '../../pages/product-prices/list/ui/ProductPricesListPage';
import { ProductCatalogDetailPage } from '../../pages/product-catalogs/detail/ui/ProductCatalogDetailPage';
import { ProductCatalogsListPage } from '../../pages/product-catalogs/list/ui/ProductCatalogsListPage';
import { PurchaseRequestDetailPage } from '../../pages/purchase-requests/detail/ui/PurchaseRequestDetailPage';
import { PurchaseRequestsListPage } from '../../pages/purchase-requests/list/ui/PurchaseRequestsListPage';
import { PurchaseBasketDetailPage } from '../../pages/purchase-baskets/detail/ui/PurchaseBasketDetailPage';
import { PurchaseBasketsListPage } from '../../pages/purchase-baskets/list/ui/PurchaseBasketsListPage';
import { PurchaseOrderDetailPage } from '../../pages/purchase-orders/detail/ui/PurchaseOrderDetailPage';
import { PurchaseOrdersListPage } from '../../pages/purchase-orders/list/ui/PurchaseOrdersListPage';
import { OfferDetailPage } from '../../pages/offers/detail/ui/OfferDetailPage';
import { OffersListPage } from '../../pages/offers/list/ui/OffersListPage';
import { ContractDetailPage } from '../../pages/contracts/detail/ui/ContractDetailPage';
import { ContractsListPage } from '../../pages/contracts/list/ui/ContractsListPage';
import { BudgetDetailPage } from '../../pages/budgets/detail/ui/BudgetDetailPage';
import { BudgetsListPage } from '../../pages/budgets/list/ui/BudgetsListPage';
import { EDocumentDetailPage } from '../../pages/edocuments/detail/ui/EDocumentDetailPage';
import { EDocumentsListPage } from '../../pages/edocuments/list/ui/EDocumentsListPage';
import { ProtectedShell } from './ProtectedShell';
import { RoutePaths, RoutePatterns } from './paths';

export const router = createBrowserRouter([
  { path: RoutePaths.Login, element: <LoginPage /> },

  {
    element: <ProtectedShell />,
    children: [
      { path: RoutePaths.Home, element: <HomePage /> },

      { path: RoutePatterns.AccountsList, element: <AccountsListPage /> },
      { path: RoutePatterns.AccountNew, element: <AccountDetailPage /> },
      { path: RoutePatterns.AccountEdit, element: <AccountDetailPage /> },
      { path: RoutePatterns.AccountView, element: <AccountDetailPage /> },

      { path: RoutePatterns.OrganizationsList, element: <OrganizationsListPage /> },
      { path: RoutePatterns.OrganizationNew, element: <OrganizationDetailPage /> },
      { path: RoutePatterns.OrganizationEdit, element: <OrganizationDetailPage /> },
      { path: RoutePatterns.OrganizationView, element: <OrganizationDetailPage /> },

      { path: RoutePatterns.BrandsList, element: <BrandsListPage /> },
      { path: RoutePatterns.BrandNew, element: <BrandDetailPage /> },
      { path: RoutePatterns.BrandEdit, element: <BrandDetailPage /> },
      { path: RoutePatterns.BrandView, element: <BrandDetailPage /> },

      { path: RoutePatterns.ManufacturersList, element: <ManufacturersListPage /> },
      { path: RoutePatterns.ManufacturerNew, element: <ManufacturerDetailPage /> },
      { path: RoutePatterns.ManufacturerEdit, element: <ManufacturerDetailPage /> },
      { path: RoutePatterns.ManufacturerView, element: <ManufacturerDetailPage /> },

      { path: RoutePatterns.ProductCategoriesList, element: <ProductCategoriesListPage /> },
      { path: RoutePatterns.ProductCategoryNew, element: <ProductCategoryDetailPage /> },
      { path: RoutePatterns.ProductCategoryEdit, element: <ProductCategoryDetailPage /> },
      { path: RoutePatterns.ProductCategoryView, element: <ProductCategoryDetailPage /> },

      { path: RoutePatterns.BudgetCategoriesList, element: <BudgetCategoriesListPage /> },
      { path: RoutePatterns.BudgetCategoryNew, element: <BudgetCategoryDetailPage /> },
      { path: RoutePatterns.BudgetCategoryEdit, element: <BudgetCategoryDetailPage /> },
      { path: RoutePatterns.BudgetCategoryView, element: <BudgetCategoryDetailPage /> },

      { path: RoutePatterns.QuestionnairesList, element: <QuestionnairesListPage /> },
      { path: RoutePatterns.QuestionnaireNew, element: <QuestionnaireDetailPage /> },
      { path: RoutePatterns.QuestionnaireEdit, element: <QuestionnaireDetailPage /> },
      { path: RoutePatterns.QuestionnaireView, element: <QuestionnaireDetailPage /> },

      { path: RoutePatterns.PriceListsList, element: <PriceListsListPage /> },
      { path: RoutePatterns.PriceListNew, element: <PriceListDetailPage /> },
      { path: RoutePatterns.PriceListEdit, element: <PriceListDetailPage /> },
      { path: RoutePatterns.PriceListView, element: <PriceListDetailPage /> },

      { path: RoutePatterns.ProductsList, element: <ProductsListPage /> },
      { path: RoutePatterns.ProductNew, element: <ProductDetailPage /> },
      { path: RoutePatterns.ProductEdit, element: <ProductDetailPage /> },
      { path: RoutePatterns.ProductView, element: <ProductDetailPage /> },

      { path: RoutePatterns.ProductPricesList, element: <ProductPricesListPage /> },
      { path: RoutePatterns.ProductPriceNew, element: <ProductPriceDetailPage /> },
      { path: RoutePatterns.ProductPriceEdit, element: <ProductPriceDetailPage /> },
      { path: RoutePatterns.ProductPriceView, element: <ProductPriceDetailPage /> },

      { path: RoutePatterns.ProductCatalogsList, element: <ProductCatalogsListPage /> },
      { path: RoutePatterns.ProductCatalogNew, element: <ProductCatalogDetailPage /> },
      { path: RoutePatterns.ProductCatalogEdit, element: <ProductCatalogDetailPage /> },
      { path: RoutePatterns.ProductCatalogView, element: <ProductCatalogDetailPage /> },

      { path: RoutePatterns.PurchaseRequestsList, element: <PurchaseRequestsListPage /> },
      { path: RoutePatterns.PurchaseRequestNew, element: <PurchaseRequestDetailPage /> },
      { path: RoutePatterns.PurchaseRequestEdit, element: <PurchaseRequestDetailPage /> },
      { path: RoutePatterns.PurchaseRequestView, element: <PurchaseRequestDetailPage /> },

      { path: RoutePatterns.PurchaseBasketsList, element: <PurchaseBasketsListPage /> },
      { path: RoutePatterns.PurchaseBasketNew, element: <PurchaseBasketDetailPage /> },
      { path: RoutePatterns.PurchaseBasketEdit, element: <PurchaseBasketDetailPage /> },
      { path: RoutePatterns.PurchaseBasketView, element: <PurchaseBasketDetailPage /> },

      { path: RoutePatterns.PurchaseOrdersList, element: <PurchaseOrdersListPage /> },
      { path: RoutePatterns.PurchaseOrderNew, element: <PurchaseOrderDetailPage /> },
      { path: RoutePatterns.PurchaseOrderEdit, element: <PurchaseOrderDetailPage /> },
      { path: RoutePatterns.PurchaseOrderView, element: <PurchaseOrderDetailPage /> },

      { path: RoutePatterns.OffersList, element: <OffersListPage /> },
      { path: RoutePatterns.OfferNew, element: <OfferDetailPage /> },
      { path: RoutePatterns.OfferEdit, element: <OfferDetailPage /> },
      { path: RoutePatterns.OfferView, element: <OfferDetailPage /> },

      { path: RoutePatterns.ContractsList, element: <ContractsListPage /> },
      { path: RoutePatterns.ContractNew, element: <ContractDetailPage /> },
      { path: RoutePatterns.ContractEdit, element: <ContractDetailPage /> },
      { path: RoutePatterns.ContractView, element: <ContractDetailPage /> },

      { path: RoutePatterns.BudgetsList, element: <BudgetsListPage /> },
      { path: RoutePatterns.BudgetNew, element: <BudgetDetailPage /> },
      { path: RoutePatterns.BudgetEdit, element: <BudgetDetailPage /> },
      { path: RoutePatterns.BudgetView, element: <BudgetDetailPage /> },

      { path: RoutePatterns.EDocumentsList, element: <EDocumentsListPage /> },
      { path: RoutePatterns.EDocumentNew, element: <EDocumentDetailPage /> },
      { path: RoutePatterns.EDocumentEdit, element: <EDocumentDetailPage /> },
      { path: RoutePatterns.EDocumentView, element: <EDocumentDetailPage /> },

      { path: RoutePatterns.AppUsersList, element: <AppUsersListPage /> },
      { path: RoutePatterns.AppUserNew, element: <AppUserDetailPage /> },
      { path: RoutePatterns.AppUserEdit, element: <AppUserDetailPage /> },
      { path: RoutePatterns.AppUserView, element: <AppUserDetailPage /> },

      { path: RoutePatterns.AppRolesList, element: <AppRolesListPage /> },
      { path: RoutePatterns.AppRoleNew, element: <AppRoleDetailPage /> },
      { path: RoutePatterns.AppRoleEdit, element: <AppRoleDetailPage /> },
      { path: RoutePatterns.AppRoleView, element: <AppRoleDetailPage /> },
    ],
  },
]);
