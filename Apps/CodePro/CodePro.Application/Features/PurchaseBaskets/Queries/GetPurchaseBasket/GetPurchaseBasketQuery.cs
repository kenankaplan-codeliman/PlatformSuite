using CodePro.Application.Features.PurchaseBaskets.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseBaskets.Queries.GetPurchaseBasket;

public sealed record GetPurchaseBasketQuery(Guid Id) : IQuery<PurchaseBasketDetailItem>;
