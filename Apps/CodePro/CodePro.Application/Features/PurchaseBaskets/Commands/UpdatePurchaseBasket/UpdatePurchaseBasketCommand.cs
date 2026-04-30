using CodePro.Application.Features.PurchaseBaskets.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PurchaseBaskets.Commands.UpdatePurchaseBasket;

public sealed class UpdatePurchaseBasketCommand : ICommand<PurchaseBasketDetailItem>
{
    public Guid Id { get; init; }
    public PurchaseBasketStatus Status { get; init; }
    public Guid? PurchaseRequestId { get; init; }
    public List<PurchaseBasketLineItem> Lines { get; init; } = new();
}
