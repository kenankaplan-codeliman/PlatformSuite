import { useTranslation } from 'react-i18next';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  WalletOutlined,
  SettingOutlined,
  ContactsOutlined,
} from '@ant-design/icons';
import { entityMenuItem, useEntityTypeRegistry, type MenuSchema } from '@platform/ui';
import { RoutePaths } from '../router/paths';

export function useCodeProMenu(): MenuSchema {
  const { t } = useTranslation('app.codepro-menu');
  const { get } = useEntityTypeRegistry();

  return [
    { key: 'home', label: t('home'), icon: <HomeOutlined />, to: RoutePaths.Home },
    {
      key: 'suppliers-group',
      label: t('groups.suppliers'),
      icon: <ContactsOutlined />,
      children: [
        entityMenuItem(get('Supplier')!, t, { label: t('suppliers'), to: RoutePaths.SuppliersList }),
        entityMenuItem(get('Activity')!, t, { label: t('activities'), to: RoutePaths.ActivitiesList }),
      ],
    },
    {
      key: 'purchase',
      label: t('groups.purchase'),
      icon: <ShoppingCartOutlined />,
      children: [
        entityMenuItem(get('PurchaseRequest')!, t, { key: 'pr', label: t('purchaseRequests'), to: RoutePaths.PurchaseRequestsList }),
        entityMenuItem(get('PurchaseBasket')!, t, { key: 'pb', label: t('purchaseBaskets'), to: RoutePaths.PurchaseBasketsList }),
        entityMenuItem(get('PurchaseOrder')!, t, { key: 'po', label: t('purchaseOrders'), to: RoutePaths.PurchaseOrdersList }),
        entityMenuItem(get('Offer')!, t, { label: t('offers'), to: RoutePaths.OffersList }),
        entityMenuItem(get('Contract')!, t, { label: t('contracts'), to: RoutePaths.ContractsList }),
      ],
    },
    {
      key: 'products',
      label: t('groups.products'),
      icon: <AppstoreOutlined />,
      children: [
        entityMenuItem(get('Product')!, t, { label: t('products'), to: RoutePaths.ProductsList }),
        entityMenuItem(get('ProductCategory')!, t, { key: 'pcat', label: t('productCategories'), to: RoutePaths.ProductCategoriesList }),
        entityMenuItem(get('ProductCatalog')!, t, { key: 'pcatalog', label: t('productCatalogs'), to: RoutePaths.ProductCatalogsList }),
        entityMenuItem(get('ProductPrice')!, t, { key: 'pprice', label: t('productPrices'), to: RoutePaths.ProductPricesList }),
        entityMenuItem(get('PriceList')!, t, { key: 'pricelists', label: t('priceLists'), to: RoutePaths.PriceListsList }),
        entityMenuItem(get('Brand')!, t, { label: t('brands'), to: RoutePaths.BrandsList }),
        entityMenuItem(get('Manufacturer')!, t, { label: t('manufacturers'), to: RoutePaths.ManufacturersList }),
      ],
    },
    {
      key: 'finance',
      label: t('groups.finance'),
      icon: <WalletOutlined />,
      children: [
        entityMenuItem(get('Budget')!, t, { label: t('budgets'), to: RoutePaths.BudgetsList }),
        entityMenuItem(get('BudgetCategory')!, t, { key: 'bcat', label: t('budgetCategories'), to: RoutePaths.BudgetCategoriesList }),
        entityMenuItem(get('EDocument')!, t, { key: 'edocs', label: t('eDocuments'), to: RoutePaths.EDocumentsList }),
      ],
    },
    {
      key: 'settings',
      label: t('groups.settings'),
      icon: <SettingOutlined />,
      children: [
        entityMenuItem(get('Organization')!, t, { key: 'orgs', label: t('organizations'), to: RoutePaths.OrganizationsList }),
        entityMenuItem(get('User')!, t, { label: t('users'), to: RoutePaths.AppUsersList }),
        entityMenuItem(get('AppRole')!, t, { key: 'roles', label: t('roles'), to: RoutePaths.AppRolesList }),
        entityMenuItem(get('Questionnaire')!, t, { label: t('questionnaires'), to: RoutePaths.QuestionnairesList }),
      ],
    },
  ];
}
