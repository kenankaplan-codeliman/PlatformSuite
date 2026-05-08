using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Budgets;
using CodePro.Domain.Entities.Contracts;
using CodePro.Domain.Entities.EDocuments;
using CodePro.Domain.Entities.Offers;
using CodePro.Domain.Entities.Products;
using CodePro.Domain.Entities.PurchaseBaskets;
using CodePro.Domain.Entities.PurchaseOrders;
using CodePro.Domain.Entities.PurchaseRequests;
using CodePro.Domain.Entities.Questionnaires;
using CodePro.Domain.Entities.Suppliers;
using Platform.Application.Interfaces;
using Platform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Data;

/// <summary>
/// CodePro uygulamasına özgü DbContext. PlatformDbContext'in DbSet'lerini (Activity, Identity,
/// Attachment) devralır; CodePro aggregate'leri (Supplier, Product, Offer, Contract, Budget,
/// Purchase, Questionnaire, EDocument) burada eklenir. ICodeProDbContext sözleşmesini
/// implement eder.
/// </summary>
public sealed class CodeProDbContext : PlatformDbContext, ICodeProDbContext
{
    public CodeProDbContext(
        DbContextOptions<CodeProDbContext> options,
        IContextUser contextUser,
        IContextAuthorization contextAuthorization)
        : base(options, contextUser, contextAuthorization)
    {
    }

    // ======= Suppliers =======
    public DbSet<Supplier> Supplier { get; set; }
    public DbSet<SupplierProductCategory> SupplierProductCategory { get; set; }

    // ======= Products =======
    public DbSet<ProductCategory> ProductCategory { get; set; }
    public DbSet<Product> Product { get; set; }
    public DbSet<Brand> Brand { get; set; }
    public DbSet<Manufacturer> Manufacturer { get; set; }
    public DbSet<ProductBrand> ProductBrand { get; set; }
    public DbSet<ProductManufacturer> ProductManufacturer { get; set; }
    public DbSet<ProductKeyword> ProductKeyword { get; set; }
    public DbSet<ProductSku> ProductSku { get; set; }
    public DbSet<ProductImage> ProductImage { get; set; }
    public DbSet<ProductPrice> ProductPrice { get; set; }
    public DbSet<PriceList> PriceList { get; set; }
    public DbSet<ProductCatalog> ProductCatalog { get; set; }
    public DbSet<ProductCatalogProduct> ProductCatalogProduct { get; set; }
    public DbSet<ProductCatalogOrganization> ProductCatalogOrganization { get; set; }

    // ======= Purchases =======
    public DbSet<PurchaseRequest> PurchaseRequest { get; set; }
    public DbSet<PurchaseRequestLine> PurchaseRequestLine { get; set; }
    public DbSet<PurchaseBasket> PurchaseBasket { get; set; }
    public DbSet<PurchaseBasketLine> PurchaseBasketLine { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrder { get; set; }
    public DbSet<PurchaseOrderLine> PurchaseOrderLine { get; set; }
    public DbSet<PurchaseOrderRequestLine> PurchaseOrderRequestLine { get; set; }

    // ======= EDocuments =======
    public DbSet<EDocument> EDocument { get; set; }
    public DbSet<EDocumentApproval> EDocumentApproval { get; set; }
    public DbSet<EDocumentComment> EDocumentComment { get; set; }

    // ======= Questionnaires =======
    public DbSet<Questionnaire> Questionnaire { get; set; }
    public DbSet<QuestionnaireQuestion> QuestionnaireQuestion { get; set; }
    public DbSet<QuestionnaireQuestionOption> QuestionnaireQuestionOption { get; set; }

    // ======= Contracts =======
    public DbSet<Contract> Contract { get; set; }
    public DbSet<ContractApprovalStep> ContractApprovalStep { get; set; }
    public DbSet<ContractForm> ContractForm { get; set; }
    public DbSet<ContractFormAnswer> ContractFormAnswer { get; set; }

    // ======= Offers =======
    public DbSet<Offer> Offer { get; set; }
    public DbSet<OfferItem> OfferItem { get; set; }
    public DbSet<OfferApprovalStep> OfferApprovalStep { get; set; }
    public DbSet<OfferForm> OfferForm { get; set; }
    public DbSet<OfferFormAnswer> OfferFormAnswer { get; set; }
    public DbSet<OfferInvitee> OfferInvitee { get; set; }

    // ======= Budgets =======
    public DbSet<Budget> Budget { get; set; }
    public DbSet<BudgetCategory> BudgetCategory { get; set; }
    public DbSet<BudgetTransaction> BudgetTransaction { get; set; }
    public DbSet<BudgetAllocation> BudgetAllocation { get; set; }
    public DbSet<BudgetApprovalStep> BudgetApprovalStep { get; set; }

    // Attachment — Platform-seviye DbSet, base PlatformDbContext'ten geliyor.

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CodeProDbContext).Assembly);
    }
}
