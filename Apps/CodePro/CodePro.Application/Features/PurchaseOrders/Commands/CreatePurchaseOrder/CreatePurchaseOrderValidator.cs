using FluentValidation;

namespace CodePro.Application.Features.PurchaseOrders.Commands.CreatePurchaseOrder;

public sealed class CreatePurchaseOrderValidator : AbstractValidator<CreatePurchaseOrderCommand>
{
    public CreatePurchaseOrderValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.OrderNumber).MaximumLength(50);
        RuleFor(x => x.SupplierAccount).NotNull();
        RuleFor(x => x.SupplierAccount!.Id).NotEmpty().When(x => x.SupplierAccount != null);
        RuleFor(x => x.CurrencyCode).MaximumLength(10);
    }
}
