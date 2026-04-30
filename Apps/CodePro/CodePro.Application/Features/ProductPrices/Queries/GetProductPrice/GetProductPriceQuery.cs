using CodePro.Application.Features.ProductPrices.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductPrices.Queries.GetProductPrice;

public sealed record GetProductPriceQuery(Guid Id) : IQuery<ProductPriceDetailItem>;
