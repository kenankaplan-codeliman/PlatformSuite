
namespace CRM.Application.Modals.ActivityModal
{
    public class ActivityListResponse
    {
        public List<ActivityListItem> Data { get; set; } = default!;
        public bool HasMore { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }

    }
}
