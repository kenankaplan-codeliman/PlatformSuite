using CRM.Application.Modals.ActivityModal;

namespace CRM.Api.Contracts.Requests.Activity
{
    public class AppointmentUpdateRequest
    {
        public Guid Id { get; set; }
        public AppointmentModal Data { get; set; } = default!;
    }
}
