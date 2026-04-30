namespace CodePro.Application.Features.BudgetCategories.Dtos;

public class BudgetCategoryListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Code { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public string? ParentCategoryName { get; set; }
    public bool IsActive { get; set; }
}
