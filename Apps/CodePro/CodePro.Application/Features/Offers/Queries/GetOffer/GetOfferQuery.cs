using CodePro.Application.Features.Offers.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Offers.Queries.GetOffer;

public sealed record GetOfferQuery(Guid Id) : IQuery<OfferDetailItem>;
