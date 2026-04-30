using FluentValidation;

namespace CodePro.Application.Features.BudgetCategories.Commands.UpdateBudgetCategory;

public sealed class UpdateBudgetCategoryValidator : AbstractValidator<UpdateBudgetCategoryCommand>
{
    public UpdateBudgetCategoryValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Code).MaximumLength(50);
        RuleFor(x => x.Description).MaximumLength(1000);
    }
}
