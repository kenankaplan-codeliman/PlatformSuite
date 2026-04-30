namespace CodePro.Domain.Authorization;

/// <summary>
/// CodePro uygulamasına özgü privilege code'ları. UserPrivilegeCodes ve ActivityPrivilegeCodes
/// Platform.Domain.Authorization.PrivilegeCodes altında zaten tanımlı; burada CodePro
/// aggregate'lerine ait kodlar bulunur. CodePro.Application.AddCodeProApplication() içinde
/// PrivilegeRegistry.Register(typeof(CodeProPrivilegeCodes)) ile platform seed'e eklenir.
/// </summary>
public static class CodeProPrivilegeCodes
{
    // Supplier privilege code'ları kaldırıldı — Tedarikçi artık Platform Account
    // (AccountType=Vendor); AccountPrivilegeCodes (Platform) yetkili.

    public static class PurchaseRequestPrivilegeCodes
    {
        public const string Read = "PurchaseRequest.Read";
        public const string Create = "PurchaseRequest.Create";
        public const string Update = "PurchaseRequest.Update";
        public const string Delete = "PurchaseRequest.Delete";
        public const string Assign = "PurchaseRequest.Assign";
        public const string State = "PurchaseRequest.State";
    }

    public static class PurchaseOrderPrivilegeCodes
    {
        public const string Read = "PurchaseOrder.Read";
        public const string Create = "PurchaseOrder.Create";
        public const string Update = "PurchaseOrder.Update";
        public const string Delete = "PurchaseOrder.Delete";
        public const string Assign = "PurchaseOrder.Assign";
        public const string State = "PurchaseOrder.State";
    }

    public static class PurchaseBasketPrivilegeCodes
    {
        public const string Read = "PurchaseBasket.Read";
        public const string Create = "PurchaseBasket.Create";
        public const string Update = "PurchaseBasket.Update";
        public const string Delete = "PurchaseBasket.Delete";
    }

    public static class ProductPrivilegeCodes
    {
        public const string Read = "Product.Read";
        public const string Create = "Product.Create";
        public const string Update = "Product.Update";
        public const string Delete = "Product.Delete";
        public const string State = "Product.State";
    }

    public static class ProductCategoryPrivilegeCodes
    {
        public const string Read = "ProductCategory.Read";
        public const string Create = "ProductCategory.Create";
        public const string Update = "ProductCategory.Update";
        public const string Delete = "ProductCategory.Delete";
    }

    public static class ProductCatalogPrivilegeCodes
    {
        public const string Read = "ProductCatalog.Read";
        public const string Create = "ProductCatalog.Create";
        public const string Update = "ProductCatalog.Update";
        public const string Delete = "ProductCatalog.Delete";
    }

    public static class BrandPrivilegeCodes
    {
        public const string Read = "Brand.Read";
        public const string Create = "Brand.Create";
        public const string Update = "Brand.Update";
        public const string Delete = "Brand.Delete";
    }

    public static class ManufacturerPrivilegeCodes
    {
        public const string Read = "Manufacturer.Read";
        public const string Create = "Manufacturer.Create";
        public const string Update = "Manufacturer.Update";
        public const string Delete = "Manufacturer.Delete";
    }

    public static class PriceListPrivilegeCodes
    {
        public const string Read = "PriceList.Read";
        public const string Create = "PriceList.Create";
        public const string Update = "PriceList.Update";
        public const string Delete = "PriceList.Delete";
        public const string State = "PriceList.State";
    }

    public static class ProductPricePrivilegeCodes
    {
        public const string Read = "ProductPrice.Read";
        public const string Create = "ProductPrice.Create";
        public const string Update = "ProductPrice.Update";
        public const string Delete = "ProductPrice.Delete";
    }

    // AttachmentPrivilegeCodes Platform.Domain.Authorization.PrivilegeCodes altına taşındı
    // (Attachment Platform-seviye; tüm app'ler kullanır).

    public static class EDocumentPrivilegeCodes
    {
        public const string Read = "EDocument.Read";
        public const string Create = "EDocument.Create";
        public const string Update = "EDocument.Update";
        public const string Delete = "EDocument.Delete";
        public const string State = "EDocument.State";
    }

    public static class QuestionnairePrivilegeCodes
    {
        public const string Read = "Questionnaire.Read";
        public const string Create = "Questionnaire.Create";
        public const string Update = "Questionnaire.Update";
        public const string Delete = "Questionnaire.Delete";
        public const string State = "Questionnaire.State";
    }

    public static class ContractPrivilegeCodes
    {
        public const string Read = "Contract.Read";
        public const string Create = "Contract.Create";
        public const string Update = "Contract.Update";
        public const string Delete = "Contract.Delete";
        public const string Approve = "Contract.Approve";
        public const string State = "Contract.State";
    }

    public static class OfferPrivilegeCodes
    {
        public const string Read = "Offer.Read";
        public const string Create = "Offer.Create";
        public const string Update = "Offer.Update";
        public const string Delete = "Offer.Delete";
        public const string Approve = "Offer.Approve";
        public const string State = "Offer.State";
    }

    public static class BudgetPrivilegeCodes
    {
        public const string Read = "Budget.Read";
        public const string Create = "Budget.Create";
        public const string Update = "Budget.Update";
        public const string Delete = "Budget.Delete";
        public const string State = "Budget.State";
        public const string Increase = "Budget.Increase";
        public const string Reserve = "Budget.Reserve";
    }

    public static class BudgetCategoryPrivilegeCodes
    {
        public const string Read = "BudgetCategory.Read";
        public const string Create = "BudgetCategory.Create";
        public const string Update = "BudgetCategory.Update";
        public const string Delete = "BudgetCategory.Delete";
    }

    // AppOrganizationPrivilegeCodes Platform.Domain.Authorization.PrivilegeCodes altına taşındı
    // (AppOrganization artık Platform-seviye CRUD; tüm app'ler kullanır).
}
