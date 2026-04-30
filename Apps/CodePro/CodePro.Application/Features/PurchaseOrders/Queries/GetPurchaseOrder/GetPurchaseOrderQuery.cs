using CodePro.Application.Features.PurchaseOrders.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseOrders.Queries.GetPurchaseOrder;

public sealed record GetPurchaseOrderQuery(Guid Id) : IQuery<PurchaseOrderDetailItem>;
