using CodePro.Application.Features.Products.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Products.Queries.GetProduct;

public sealed record GetProductQuery(Guid Id) : IQuery<ProductDetailItem>;
