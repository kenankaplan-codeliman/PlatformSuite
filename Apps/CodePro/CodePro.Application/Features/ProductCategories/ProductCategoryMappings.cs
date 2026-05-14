using CodePro.Application.Features.ProductCategories.Commands.CreateProductCategory;
using CodePro.Application.Features.ProductCategories.Commands.UpdateProductCategory;
using CodePro.Application.Features.ProductCategories.Dtos;
using CodePro.Domain.Entities.Products;
using Platform.Application.Mapping;
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
            .Ignore(d => d.Title,
                    d => d.ParentCategory!, d => d.ChildCategories, d => d.Products)
            .IgnoreAuditFields();

        config.NewConfig<UpdateProductCategoryCommand, ProductCategory>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Title,
                    d => d.ParentCategory!, d => d.ChildCategories, d => d.Products)
            .IgnoreAuditFields();
    }
}
