using FluentValidation;

namespace CodePro.Application.Features.BudgetCategories.Commands.CreateBudgetCategory;

public sealed class CreateBudgetCategoryValidator : AbstractValidator<CreateBudgetCategoryCommand>
{
    public CreateBudgetCategoryValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Code).MaximumLength(50);
        RuleFor(x => x.Description).MaximumLength(1000);
    }
}
