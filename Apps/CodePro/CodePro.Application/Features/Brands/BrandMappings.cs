using CodePro.Application.Features.Brands.Commands.CreateBrand;
using CodePro.Application.Features.Brands.Commands.UpdateBrand;
using CodePro.Application.Features.Brands.Dtos;
using CodePro.Domain.Entities.Products;
using Mapster;

namespace CodePro.Application.Features.Brands;

public static class BrandMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Brand, BrandDetailItem>();
        config.NewConfig<Brand, BrandListItem>();

        config.NewConfig<CreateBrandCommand, Brand>()
            .Ignore(d => d.Id,
                    d => d.ProductBrands,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateBrandCommand, Brand>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.ProductBrands,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
