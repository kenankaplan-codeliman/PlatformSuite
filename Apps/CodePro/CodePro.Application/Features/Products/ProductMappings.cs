using CodePro.Application.Features.Products.Commands.CreateProduct;
using CodePro.Application.Features.Products.Commands.UpdateProduct;
using CodePro.Application.Features.Products.Dtos;
using CodePro.Domain.Entities.Products;
using Platform.Application.Mapping;
using Mapster;

namespace CodePro.Application.Features.Products;

public static class ProductMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Product, ProductListItem>()
            .Map(d => d.ProductCategoryName, s => s.ProductCategory != null ? s.ProductCategory.Name : null);

        config.NewConfig<CreateProductCommand, Product>()
            .Map(d => d.ProductCategoryId, s => s.ProductCategory != null ? s.ProductCategory.Id : Guid.Empty)
            .Ignore(d => d.ProductCategory!,
                    d => d.ProductBrands, d => d.ProductManufacturers, d => d.Keywords, d => d.SupplierSkus)
            .IgnoreAuditFields();

        config.NewConfig<UpdateProductCommand, Product>()
            .IgnoreNullValues(true)
            .Map(d => d.ProductCategoryId, s => s.ProductCategory != null ? s.ProductCategory.Id : Guid.Empty)
            .Ignore(d => d.ProductCategory!,
                    d => d.ProductBrands, d => d.ProductManufacturers, d => d.Keywords, d => d.SupplierSkus)
            .IgnoreAuditFields();
    }
}
