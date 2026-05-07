using FluentValidation;

namespace CodePro.Application.Features.PurchaseOrders.Commands.UpdatePurchaseOrder;

public sealed class UpdatePurchaseOrderValidator : AbstractValidator<UpdatePurchaseOrderCommand>
{
    public UpdatePurchaseOrderValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.OrderNumber).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.SupplierAccount).NotNull();
        RuleFor(x => x.SupplierAccount!.Id).NotEmpty().When(x => x.SupplierAccount != null);
        RuleFor(x => x.CurrencyCode).MaximumLength(10);
    }
}
