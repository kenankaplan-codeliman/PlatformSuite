using FluentValidation;
using Crm.Application.Features.Opportunities.Dtos;

namespace Crm.Application.Features.Opportunities.Commands.CreateOpportunity;

public sealed class CreateOpportunityValidator : AbstractValidator<CreateOpportunityCommand>
{
    public CreateOpportunityValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(250);
        RuleFor(x => x.Account).NotNull();
        RuleFor(x => x.Account!.Id).NotEmpty().When(x => x.Account != null);
        RuleFor(x => x.Stage).NotEmpty().MaximumLength(50);
        RuleFor(x => x.EstimatedAmount).GreaterThanOrEqualTo(0).When(x => x.EstimatedAmount.HasValue);
        // Currency: opsiyonel; EstimatedAmount girilmişse veya Products varsa zorunlu
        // (sayı tek başına anlamsız, line item'lar parent currency'sini paylaşır).
        // GeneralParameter code geçerliliği handler'da doğrulanır.
        RuleFor(x => x.Currency).MaximumLength(10);
        RuleFor(x => x.Currency)
            .NotEmpty()
            .When(x => x.EstimatedAmount.HasValue || (x.Products != null && x.Products.Count > 0));
        RuleFor(x => x.Probability).InclusiveBetween(0, 100);
        RuleFor(x => x.LossReason).MaximumLength(500);
        RuleForEach(x => x.Products).SetValidator(new OpportunityProductModalValidator());
    }
}

public sealed class OpportunityProductModalValidator : AbstractValidator<OpportunityProductModal>
{
    public OpportunityProductModalValidator()
    {
        RuleFor(x => x.Product).NotNull();
        RuleFor(x => x.Product!.Id).NotEmpty().When(x => x.Product != null);
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.UnitPrice).GreaterThanOrEqualTo(0);
        // UnitCode: GeneralParameter code uzunluğu domain'de string?(50) — geçerli kod
        // doğrulaması (parentCode: ProductUnitOfMeasure) handler'da değil, snapshot olarak
        // serbest bırakılır (ürün silinmiş bile olsa eski satır okunabilir kalmalı).
        RuleFor(x => x.UnitCode).MaximumLength(50);
        // İndirim: oran 0-100, tutar 0+. NetAmount handler/mapping'te 0'da clamp edilir,
        // bu nedenle "tutar > lineTotal" gibi koşullar burada engellenmez.
        RuleFor(x => x.DiscountRate).InclusiveBetween(0, 100);
        RuleFor(x => x.DiscountAmount).GreaterThanOrEqualTo(0);
    }
}
