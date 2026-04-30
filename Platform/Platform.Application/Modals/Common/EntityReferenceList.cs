
namespace Platform.Application.Modals.Common
{
    public class EntityReferenceList
    {
        public List<EntityReference> Data { get; set; } = new List<EntityReference>();
        public bool HasMore { get; set; }

        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
