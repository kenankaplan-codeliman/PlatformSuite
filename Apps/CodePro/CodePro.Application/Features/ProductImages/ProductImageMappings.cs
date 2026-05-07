using CodePro.Application.Features.ProductImages.Dtos;
using CodePro.Domain.Entities.Products;
using Mapster;

namespace CodePro.Application.Features.ProductImages;

public static class ProductImageMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ProductImage, ProductImageItem>();
    }
}
