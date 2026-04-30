namespace CodePro.Application.Features.BudgetCategories.Dtos;

public class BudgetCategoryListFilter
{
    public string? Search { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public bool? IsActive { get; set; }
}
