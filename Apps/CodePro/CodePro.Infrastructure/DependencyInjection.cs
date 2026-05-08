using CodePro.Application.Interfaces;
using CodePro.Infrastructure.Data;
using CodePro.Infrastructure.References;
using CodePro.Infrastructure.Repositories;
using CodePro.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Platform.Application.Common.References;

namespace CodePro.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddCodeProInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ICodeProDbContext → CodeProDbContext (CodeProDbContext HostBuilderExtensions tarafından kayıt edildi).
        services.AddScoped<ICodeProDbContext>(sp => sp.GetRequiredService<CodeProDbContext>());

        // CodePro aggregate repository registrasyonları (aggregate başına eklenir).
        services.AddScoped<ISupplierRepository, SupplierRepository>();
        services.AddScoped<IBrandRepository, BrandRepository>();
        services.AddScoped<IManufacturerRepository, ManufacturerRepository>();
        services.AddScoped<IProductCategoryRepository, ProductCategoryRepository>();
        services.AddScoped<IBudgetCategoryRepository, BudgetCategoryRepository>();
        services.AddScoped<IQuestionnaireRepository, QuestionnaireRepository>();
        services.AddScoped<IPriceListRepository, PriceListRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IProductImageRepository, ProductImageRepository>();
        services.AddScoped<IProductPriceRepository, ProductPriceRepository>();

        // ProductImage thumbnail üretimi
        services.AddSingleton<IImageResizer, ImageSharpResizer>();
        services.AddScoped<IProductCatalogRepository, ProductCatalogRepository>();
        services.AddScoped<IPurchaseRequestRepository, PurchaseRequestRepository>();
        services.AddScoped<IPurchaseBasketRepository, PurchaseBasketRepository>();
        services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
        services.AddScoped<IOfferRepository, OfferRepository>();
        services.AddScoped<IContractRepository, ContractRepository>();
        services.AddScoped<IBudgetRepository, BudgetRepository>();
        services.AddScoped<IEDocumentRepository, EDocumentRepository>();

        // CodePro entity'leri için Activity.RegardingEntityType / ParticipantEntityType resolver kayıtları
        services.AddScoped<IEntityReferenceResolver, SupplierReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, PurchaseOrderReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, BudgetReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, OfferReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, ContractReferenceResolver>();
        services.AddScoped<IEntityReferenceResolver, ProductReferenceResolver>();

        return services;
    }
}
