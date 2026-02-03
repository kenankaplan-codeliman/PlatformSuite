using CRM.Application.Modals.ActivityModal;

namespace CRM.Api.Contracts.Requests.Activity
{
    public class ActivityCalendarRequest
    {
        public DateTime StartDate { get; set; }= DateTime.Now;
        public DateTime EndDate { get; set; } = DateTime.Now;

        public ActivityListFilters? filters { get; set; }
    }
}
