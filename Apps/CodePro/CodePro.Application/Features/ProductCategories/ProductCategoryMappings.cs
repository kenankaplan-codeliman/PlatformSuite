using CodePro.Application.Features.ProductCategories.Commands.CreateProductCategory;
using CodePro.Application.Features.ProductCategories.Commands.UpdateProductCategory;
using CodePro.Application.Features.ProductCategories.Dtos;
using CodePro.Domain.Entities.Products;
using Mapster;

namespace CodePro.Application.Features.ProductCategories;

public static class ProductCategoryMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ProductCategory, ProductCategoryDetailItem>()
            .Map(d => d.ParentCategoryName, s => s.ParentCategory != null ? s.ParentCategory.Name : null);

        config.NewConfig<ProductCategory, ProductCategoryListItem>();

        config.NewConfig<CreateProductCategoryCommand, ProductCategory>()
            .Ignore(d => d.Id,
                    d => d.Title,
                    d => d.ParentCategory, d => d.ChildCategories, d => d.Products,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateProductCategoryCommand, ProductCategory>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.Title,
                    d => d.ParentCategory, d => d.ChildCategories, d => d.Products,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
