using CodePro.Domain.Entities.Accounts;
using CodePro.Domain.Entities.Budgets;
using CodePro.Domain.Entities.Contracts;
using CodePro.Domain.Entities.EDocuments;
using CodePro.Domain.Entities.Offers;
using CodePro.Domain.Entities.Products;
using CodePro.Domain.Entities.PurchaseBaskets;
using CodePro.Domain.Entities.PurchaseOrders;
using CodePro.Domain.Entities.PurchaseRequests;
using CodePro.Domain.Entities.Questionnaires;
using Platform.Application.Common.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Interfaces;

/// <summary>
/// CodePro uygulamasına özgü DbContext kontratı. Aggregate başına DbSet property'leri.
/// Tedarikçi entity'si yerine Platform Account (AccountType=Vendor) kullanılır.
/// Query handler'lar bu interface üzerinden EF erişim sağlar; concrete CodeProDbContext'i bilmezler.
/// </summary>
public interface ICodeProDbContext : IApplicationDbContext
{
    // Account extensions (CodePro-specific)
    DbSet<Supplier> Supplier { get; }
    DbSet<AccountProductCategory> AccountProductCategory { get; }

    // Products
    DbSet<ProductCategory> ProductCategory { get; }
    DbSet<Product> Product { get; }
    DbSet<Brand> Brand { get; }
    DbSet<Manufacturer> Manufacturer { get; }
    DbSet<ProductBrand> ProductBrand { get; }
    DbSet<ProductManufacturer> ProductManufacturer { get; }
    DbSet<ProductKeyword> ProductKeyword { get; }
    DbSet<ProductSku> ProductSku { get; }
    DbSet<ProductImage> ProductImage { get; }
    DbSet<ProductPrice> ProductPrice { get; }
    DbSet<PriceList> PriceList { get; }
    DbSet<ProductCatalog> ProductCatalog { get; }
    DbSet<ProductCatalogProduct> ProductCatalogProduct { get; }
    DbSet<ProductCatalogOrganization> ProductCatalogOrganization { get; }

    // Purchases
    DbSet<PurchaseRequest> PurchaseRequest { get; }
    DbSet<PurchaseRequestLine> PurchaseRequestLine { get; }
    DbSet<PurchaseBasket> PurchaseBasket { get; }
    DbSet<PurchaseBasketLine> PurchaseBasketLine { get; }
    DbSet<PurchaseOrder> PurchaseOrder { get; }
    DbSet<PurchaseOrderLine> PurchaseOrderLine { get; }
    DbSet<PurchaseOrderRequestLine> PurchaseOrderRequestLine { get; }

    // EDocuments
    DbSet<EDocument> EDocument { get; }
    DbSet<EDocumentApproval> EDocumentApproval { get; }
    DbSet<EDocumentComment> EDocumentComment { get; }

    // Questionnaires
    DbSet<Questionnaire> Questionnaire { get; }
    DbSet<QuestionnaireQuestion> QuestionnaireQuestion { get; }
    DbSet<QuestionnaireQuestionOption> QuestionnaireQuestionOption { get; }

    // Contracts
    DbSet<Contract> Contract { get; }
    DbSet<ContractApprovalStep> ContractApprovalStep { get; }
    DbSet<ContractForm> ContractForm { get; }
    DbSet<ContractFormAnswer> ContractFormAnswer { get; }

    // Offers
    DbSet<Offer> Offer { get; }
    DbSet<OfferItem> OfferItem { get; }
    DbSet<OfferApprovalStep> OfferApprovalStep { get; }
    DbSet<OfferForm> OfferForm { get; }
    DbSet<OfferFormAnswer> OfferFormAnswer { get; }
    DbSet<OfferInvitee> OfferInvitee { get; }

    // Budgets
    DbSet<Budget> Budget { get; }
    DbSet<BudgetCategory> BudgetCategory { get; }
    DbSet<BudgetTransaction> BudgetTransaction { get; }
    DbSet<BudgetAllocation> BudgetAllocation { get; }
    DbSet<BudgetApprovalStep> BudgetApprovalStep { get; }

    // Attachment — Platform-seviye, IApplicationDbContext üzerinden gelir.
}
