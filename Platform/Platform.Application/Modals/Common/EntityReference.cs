using Platform.Domain.Enums;

namespace Platform.Application.Modals.Common
{
    public class EntityReference
    {
        public EntityReference() { }

        public EntityReference(EntityType entityType)
        {
            EntityType = entityType;
        }

        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public EntityType EntityType { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}
