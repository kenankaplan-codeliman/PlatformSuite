using CodePro.Application.Interfaces;
using CodePro.Infrastructure.Data;
using CodePro.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
        services.AddScoped<IBrandRepository, BrandRepository>();
        services.AddScoped<IManufacturerRepository, ManufacturerRepository>();
        services.AddScoped<IProductCategoryRepository, ProductCategoryRepository>();
        services.AddScoped<IBudgetCategoryRepository, BudgetCategoryRepository>();
        services.AddScoped<IQuestionnaireRepository, QuestionnaireRepository>();
        services.AddScoped<IPriceListRepository, PriceListRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IProductPriceRepository, ProductPriceRepository>();
        services.AddScoped<IProductCatalogRepository, ProductCatalogRepository>();
        services.AddScoped<IPurchaseRequestRepository, PurchaseRequestRepository>();
        services.AddScoped<IPurchaseBasketRepository, PurchaseBasketRepository>();
        services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
        services.AddScoped<IOfferRepository, OfferRepository>();
        services.AddScoped<IContractRepository, ContractRepository>();
        services.AddScoped<IBudgetRepository, BudgetRepository>();
        services.AddScoped<IEDocumentRepository, EDocumentRepository>();

        return services;
    }
}
