namespace Platform.Application.Modals.Common
{
    /// <summary>
    /// Polimorfik referans DTO. EntityType bilinçli olarak string —
    /// User/Account/Contact dışında uygulamaya özel tipler de
    /// (PurchaseOrder, Lead, Opportunity, Brand, Product, vb.) taşınabilir.
    /// </summary>
    public class EntityReference
    {
        public EntityReference() { }

        public EntityReference(string entityType)
        {
            EntityType = entityType;
        }

        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}
