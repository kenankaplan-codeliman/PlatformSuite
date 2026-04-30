using CodePro.Application.Features.ProductCategories.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductCategories.Commands.CreateProductCategory;

public sealed class CreateProductCategoryCommand : ICommand<ProductCategoryDetailItem>
{
    public string Name { get; init; } = string.Empty;
    public string? Code { get; init; }
    public string? Description { get; init; }
    public Guid? ParentCategoryId { get; init; }
}
