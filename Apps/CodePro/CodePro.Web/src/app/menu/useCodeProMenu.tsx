import { useTranslation } from 'react-i18next';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  WalletOutlined,
  SettingOutlined,
  FileTextOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FormOutlined,
  TagsOutlined,
  ShopOutlined,
  ReadOutlined,
  DollarOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import type { MenuSchema } from '@platform/ui';
import { RoutePaths } from '../router/paths';

export function useCodeProMenu(): MenuSchema {
  const { t } = useTranslation('app.codepro-menu');
  return [
    { key: 'home', label: t('home'), icon: <HomeOutlined />, to: RoutePaths.Home },
    {
      key: 'purchase',
      label: t('groups.purchase'),
      icon: <ShoppingCartOutlined />,
      children: [
        { key: 'pr', label: t('purchaseRequests'), icon: <FileTextOutlined />, to: RoutePaths.PurchaseRequestsList },
        { key: 'pb', label: t('purchaseBaskets'), icon: <ShoppingCartOutlined />, to: RoutePaths.PurchaseBasketsList },
        { key: 'po', label: t('purchaseOrders'), icon: <ProfileOutlined />, to: RoutePaths.PurchaseOrdersList },
        { key: 'offers', label: t('offers'), icon: <FileSearchOutlined />, to: RoutePaths.OffersList },
        { key: 'contracts', label: t('contracts'), icon: <FileProtectOutlined />, to: RoutePaths.ContractsList },
      ],
    },
    {
      key: 'products',
      label: t('groups.products'),
      icon: <AppstoreOutlined />,
      children: [
        { key: 'products', label: t('products'), icon: <AppstoreOutlined />, to: RoutePaths.ProductsList },
        { key: 'pcat', label: t('productCategories'), icon: <TagsOutlined />, to: RoutePaths.ProductCategoriesList },
        { key: 'pcatalog', label: t('productCatalogs'), icon: <ReadOutlined />, to: RoutePaths.ProductCatalogsList },
        { key: 'pprice', label: t('productPrices'), icon: <DollarOutlined />, to: RoutePaths.ProductPricesList },
        { key: 'pricelists', label: t('priceLists'), icon: <DollarOutlined />, to: RoutePaths.PriceListsList },
        { key: 'brands', label: t('brands'), icon: <ShopOutlined />, to: RoutePaths.BrandsList },
        { key: 'manufacturers', label: t('manufacturers'), icon: <ShopOutlined />, to: RoutePaths.ManufacturersList },
      ],
    },
    {
      key: 'finance',
      label: t('groups.finance'),
      icon: <WalletOutlined />,
      children: [
        { key: 'budgets', label: t('budgets'), icon: <WalletOutlined />, to: RoutePaths.BudgetsList },
        { key: 'bcat', label: t('budgetCategories'), icon: <TagsOutlined />, to: RoutePaths.BudgetCategoriesList },
        { key: 'edocs', label: t('eDocuments'), icon: <FileTextOutlined />, to: RoutePaths.EDocumentsList },
      ],
    },
    {
      key: 'settings',
      label: t('groups.settings'),
      icon: <SettingOutlined />,
      children: [
        { key: 'orgs', label: t('organizations'), icon: <TeamOutlined />, to: RoutePaths.OrganizationsList },
        { key: 'accounts', label: t('accounts'), icon: <TeamOutlined />, to: RoutePaths.AccountsList },
        { key: 'users', label: t('users'), icon: <UserOutlined />, to: RoutePaths.AppUsersList },
        { key: 'roles', label: t('roles'), icon: <SafetyOutlined />, to: RoutePaths.AppRolesList },
        { key: 'questionnaires', label: t('questionnaires'), icon: <FormOutlined />, to: RoutePaths.QuestionnairesList },
      ],
    },
  ];
}
