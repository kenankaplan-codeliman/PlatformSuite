using CodePro.Application.Features.Brands.Commands.CreateBrand;
using CodePro.Application.Features.Brands.Commands.UpdateBrand;
using CodePro.Application.Features.Brands.Dtos;
using CodePro.Domain.Entities.Products;
using Platform.Application.Mapping;
using Mapster;

namespace CodePro.Application.Features.Brands;

public static class BrandMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Brand, BrandDetailItem>();
        config.NewConfig<Brand, BrandListItem>();

        config.NewConfig<CreateBrandCommand, Brand>()
            .Ignore(d => d.ProductBrands)
            .IgnoreAuditFields();

        config.NewConfig<UpdateBrandCommand, Brand>()
            .IgnoreNullValues(true)
            .Ignore(d => d.ProductBrands)
            .IgnoreAuditFields();
    }
}
