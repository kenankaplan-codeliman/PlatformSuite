using CodePro.Application.Features.PurchaseBaskets.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseBaskets.Commands.CreatePurchaseBasket;

public sealed class CreatePurchaseBasketCommand : ICommand<PurchaseBasketDetailItem>
{
    public PurchaseBasketStatus Status { get; init; } = PurchaseBasketStatus.Preparing;
    public Guid? PurchaseRequestId { get; init; }
    public List<PurchaseBasketLineItem> Lines { get; init; } = new();
}
