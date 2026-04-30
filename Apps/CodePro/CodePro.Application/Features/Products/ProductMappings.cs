using CodePro.Application.Features.Products.Commands.CreateProduct;
using CodePro.Application.Features.Products.Commands.UpdateProduct;
using CodePro.Application.Features.Products.Dtos;
using CodePro.Domain.Entities.Products;
using Mapster;

namespace CodePro.Application.Features.Products;

public static class ProductMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Product, ProductListItem>()
            .Map(d => d.ProductCategoryName, s => s.ProductCategory != null ? s.ProductCategory.Name : null);

        config.NewConfig<CreateProductCommand, Product>()
            .Ignore(d => d.Id,
                    d => d.ProductCategory!,
                    d => d.ProductBrands, d => d.ProductManufacturers, d => d.Keywords, d => d.SupplierSkus,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateProductCommand, Product>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.ProductCategory!,
                    d => d.ProductBrands, d => d.ProductManufacturers, d => d.Keywords, d => d.SupplierSkus,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
