import {
  ApartmentOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BuildOutlined,
  DollarCircleOutlined,
  DollarOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  FormOutlined,
  ReadOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TagOutlined,
  TagsOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import type { EntityTypeMeta } from '@platform/ui';
import { RoutePaths } from '../../app/router/paths';

/**
 * CodePro'nun polimorfik referans alanlarında çıkabilecek entity türleri için
 * görsel + navigasyon metadata'sı. App.tsx `EntityTypeRegistryProvider`'a
 * `platformEntityTypes` ile birleştirerek geçer.
 *
 * Yeni bir CodePro entity'si eklemek için: bu listeye bir entry, i18n çevirisi
 * (`app.codepro/tr.json` -> `entities.<key>`) ekle — menu/badge/lookup/popup/
 * list-page title icon'u otomatik tanır.
 *
 * Label namespace-prefix'lidir (`'app.codepro:entities.x'`) ki tüketici tarafın
 * aktif namespace'inden bağımsız `t(meta.label)` çağrısı doğru çeviriyi alsın.
 */
export const codeproEntityTypes: EntityTypeMeta[] = [
  {
    key: 'Supplier',
    label: 'app.codepro:entities.supplier',
    labelPlural: 'app.codepro:entities.suppliers',
    icon: TeamOutlined,
    tone: 'blue',
    getDetailHref: (id) => RoutePaths.SupplierView(id),
  },
  {
    key: 'PurchaseRequest',
    label: 'app.codepro:entities.purchaseRequest',
    labelPlural: 'app.codepro:entities.purchaseRequests',
    icon: FileSearchOutlined,
    tone: 'red',
    getDetailHref: (id) => RoutePaths.PurchaseRequestView(id),
  },
  {
    key: 'PurchaseBasket',
    label: 'app.codepro:entities.purchaseBasket',
    labelPlural: 'app.codepro:entities.purchaseBaskets',
    icon: ShoppingOutlined,
    tone: 'orange',
    getDetailHref: (id) => RoutePaths.PurchaseBasketView(id),
  },
  {
    key: 'PurchaseOrder',
    label: 'app.codepro:entities.purchaseOrder',
    labelPlural: 'app.codepro:entities.purchaseOrders',
    icon: ShoppingCartOutlined,
    tone: 'volcano',
    getDetailHref: (id) => RoutePaths.PurchaseOrderView(id),
  },
  {
    key: 'Offer',
    label: 'app.codepro:entities.offer',
    labelPlural: 'app.codepro:entities.offers',
    icon: FileTextOutlined,
    tone: 'cyan',
    getDetailHref: (id) => RoutePaths.OfferView(id),
  },
  {
    key: 'Contract',
    label: 'app.codepro:entities.contract',
    labelPlural: 'app.codepro:entities.contracts',
    icon: FileDoneOutlined,
    tone: 'purple',
    getDetailHref: (id) => RoutePaths.ContractView(id),
  },
  {
    key: 'Budget',
    label: 'app.codepro:entities.budget',
    labelPlural: 'app.codepro:entities.budgets',
    icon: WalletOutlined,
    tone: 'gold',
    getDetailHref: (id) => RoutePaths.BudgetView(id),
  },
  {
    key: 'BudgetCategory',
    label: 'app.codepro:entities.budgetCategory',
    labelPlural: 'app.codepro:entities.budgetCategories',
    icon: ApartmentOutlined,
    tone: 'lime',
    getDetailHref: (id) => RoutePaths.BudgetCategoryView(id),
  },
  {
    key: 'Product',
    label: 'app.codepro:entities.product',
    labelPlural: 'app.codepro:entities.products',
    icon: AppstoreOutlined,
    tone: 'green',
    getDetailHref: (id) => RoutePaths.ProductView(id),
  },
  {
    key: 'ProductCategory',
    label: 'app.codepro:entities.productCategory',
    labelPlural: 'app.codepro:entities.productCategories',
    icon: TagsOutlined,
    tone: 'green',
    getDetailHref: (id) => RoutePaths.ProductCategoryView(id),
  },
  {
    key: 'ProductCatalog',
    label: 'app.codepro:entities.productCatalog',
    labelPlural: 'app.codepro:entities.productCatalogs',
    icon: ReadOutlined,
    tone: 'cyan',
    getDetailHref: (id) => RoutePaths.ProductCatalogView(id),
  },
  {
    key: 'ProductPrice',
    label: 'app.codepro:entities.productPrice',
    labelPlural: 'app.codepro:entities.productPrices',
    icon: DollarOutlined,
    tone: 'gold',
    getDetailHref: (id) => RoutePaths.ProductPriceView(id),
  },
  {
    key: 'PriceList',
    label: 'app.codepro:entities.priceList',
    labelPlural: 'app.codepro:entities.priceLists',
    icon: DollarCircleOutlined,
    tone: 'magenta',
    getDetailHref: (id) => RoutePaths.PriceListView(id),
  },
  {
    key: 'Brand',
    label: 'app.codepro:entities.brand',
    labelPlural: 'app.codepro:entities.brands',
    icon: TagOutlined,
    tone: 'purple',
    getDetailHref: (id) => RoutePaths.BrandView(id),
  },
  {
    key: 'Manufacturer',
    label: 'app.codepro:entities.manufacturer',
    labelPlural: 'app.codepro:entities.manufacturers',
    icon: BuildOutlined,
    tone: 'orange',
    getDetailHref: (id) => RoutePaths.ManufacturerView(id),
  },
  {
    key: 'Questionnaire',
    label: 'app.codepro:entities.questionnaire',
    labelPlural: 'app.codepro:entities.questionnaires',
    icon: FormOutlined,
    tone: 'geekblue',
    getDetailHref: (id) => RoutePaths.QuestionnaireView(id),
  },
  {
    key: 'EDocument',
    label: 'app.codepro:entities.eDocument',
    labelPlural: 'app.codepro:entities.eDocuments',
    icon: AuditOutlined,
    tone: 'geekblue',
    getDetailHref: (id) => RoutePaths.EDocumentView(id),
  },
];
