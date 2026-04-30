using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseOrders.Commands.DeletePurchaseOrder;

public sealed record DeletePurchaseOrderCommand(Guid Id) : ICommand;
