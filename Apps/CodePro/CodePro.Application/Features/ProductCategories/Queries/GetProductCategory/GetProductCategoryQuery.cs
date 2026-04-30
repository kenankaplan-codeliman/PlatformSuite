using CodePro.Application.Features.ProductCategories.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductCategories.Queries.GetProductCategory;

public sealed record GetProductCategoryQuery(Guid Id) : IQuery<ProductCategoryDetailItem>;
