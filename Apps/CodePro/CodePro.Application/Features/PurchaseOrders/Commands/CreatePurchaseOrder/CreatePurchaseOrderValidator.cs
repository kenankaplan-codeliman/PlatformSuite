using FluentValidation;

namespace CodePro.Application.Features.PurchaseOrders.Commands.CreatePurchaseOrder;

public sealed class CreatePurchaseOrderValidator : AbstractValidator<CreatePurchaseOrderCommand>
{
    public CreatePurchaseOrderValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.OrderNumber).MaximumLength(50);
        RuleFor(x => x.Supplier).NotNull();
        RuleFor(x => x.Supplier!.Id).NotEmpty().When(x => x.Supplier != null);
        RuleFor(x => x.CurrencyCode).MaximumLength(10);
    }
}
