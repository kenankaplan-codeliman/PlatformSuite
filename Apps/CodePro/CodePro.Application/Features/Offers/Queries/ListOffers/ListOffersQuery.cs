using CodePro.Application.Features.Offers.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.Offers.Queries.ListOffers;

public sealed class ListOffersQuery : IQuery<PagedResult<OfferListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public OfferListFilter Filters { get; init; } = new();
}
