using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Budgets
{
    public class BudgetCategory : IBaseEntity, ISoftDeleteEntity, IAuditableEntity, IOwnedEntity
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? Description { get; set; }

        public Guid? ParentCategoryId { get; set; }
        public BudgetCategory? ParentCategory { get; set; }
        public ICollection<BudgetCategory> ChildCategories { get; set; } = new List<BudgetCategory>();

        public bool IsActive { get; private set; } = true;

        public Guid CreatedBy { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Guid? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public bool IsDeleted { get; private set; }
        public Guid? DeletedBy { get; private set; }
        public DateTime? DeletedAt { get; private set; }

        public Guid OwnerId { get; set; }
        public Guid OrganizationId { get; private set; }
    }
}
