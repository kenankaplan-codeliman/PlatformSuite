using CodePro.Application.Features.BudgetCategories.Commands.CreateBudgetCategory;
using CodePro.Application.Features.BudgetCategories.Commands.UpdateBudgetCategory;
using CodePro.Application.Features.BudgetCategories.Dtos;
using CodePro.Domain.Entities.Budgets;
using Platform.Application.Mapping;
using Mapster;

namespace CodePro.Application.Features.BudgetCategories;

public static class BudgetCategoryMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<BudgetCategory, BudgetCategoryDetailItem>()
            .Map(d => d.ParentCategoryName, s => s.ParentCategory != null ? s.ParentCategory.Name : null);

        config.NewConfig<BudgetCategory, BudgetCategoryListItem>();

        config.NewConfig<CreateBudgetCategoryCommand, BudgetCategory>()
            .Ignore(d => d.ParentCategory!, d => d.ChildCategories,
                    d => d.OwnerId, d => d.OrganizationId)
            .IgnoreAuditFields();

        config.NewConfig<UpdateBudgetCategoryCommand, BudgetCategory>()
            .IgnoreNullValues(true)
            .Ignore(d => d.ParentCategory!, d => d.ChildCategories,
                    d => d.OwnerId, d => d.OrganizationId)
            .IgnoreAuditFields();
    }
}
