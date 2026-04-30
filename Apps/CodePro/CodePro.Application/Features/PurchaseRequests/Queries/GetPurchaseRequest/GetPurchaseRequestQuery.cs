using CodePro.Application.Features.PurchaseRequests.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseRequests.Queries.GetPurchaseRequest;

public sealed record GetPurchaseRequestQuery(Guid Id) : IQuery<PurchaseRequestDetailItem>;
