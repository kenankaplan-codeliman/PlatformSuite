using CodePro.Application.Features.Brands;
using CodePro.Application.Features.BudgetCategories;
using CodePro.Application.Features.Manufacturers;
using CodePro.Application.Features.PriceLists;
using CodePro.Application.Features.ProductCategories;
using CodePro.Application.Features.ProductPrices;
using CodePro.Application.Features.Products;
using CodePro.Application.Features.Questionnaires;
using Mapster;

namespace CodePro.Application.Mapping;

/// <summary>
/// CodePro Mapster konfigürasyon ana giriş noktası — TypeAdapterConfig.GlobalSettings
/// üzerinde aggregate başına mapping registrar'ları çağrılır.
/// </summary>
public static class CodeProMappingConfig
{
    public static void Register(TypeAdapterConfig config)
    {
        BrandMappings.Register(config);
        ManufacturerMappings.Register(config);
        ProductCategoryMappings.Register(config);
        BudgetCategoryMappings.Register(config);
        QuestionnaireMappings.Register(config);
        PriceListMappings.Register(config);
        ProductMappings.Register(config);
        ProductPriceMappings.Register(config);
    }
}
