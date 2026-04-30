using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseRequests.Commands.DeletePurchaseRequest;

public sealed record DeletePurchaseRequestCommand(Guid Id) : ICommand;
