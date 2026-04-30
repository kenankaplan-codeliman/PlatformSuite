using CodePro.Application.Features.PriceLists.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PriceLists.Queries.GetPriceList;

public sealed record GetPriceListQuery(Guid Id) : IQuery<PriceListDetailItem>;
