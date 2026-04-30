using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseBaskets.Commands.DeletePurchaseBasket;

public sealed record DeletePurchaseBasketCommand(Guid Id) : ICommand;
