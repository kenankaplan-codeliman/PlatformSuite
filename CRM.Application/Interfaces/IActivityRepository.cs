using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Activity;

namespace CRM.Application.Interfaces
{
    public interface IActivityRepository
    {
        ActivityListResponse List(ActivityListFilters? filter, PaginationInfo? paginationInfo);
        List<ActivityListItem> Calendar(ActivityListFilters? filters, DateTime startDate, DateTime endDate);

        #region Appointment

        Appointment CreateAppointment(Appointment entity);
        Appointment UpdateAppointment(Appointment entity);
        Appointment DeleteAppointment(Appointment entity);
        Appointment GetAppointment(Guid Id);

        #endregion

        #region PhoneCall

        PhoneCall CreatePhoneCall(PhoneCall entity);
        PhoneCall UpdatePhoneCall(PhoneCall entity);
        PhoneCall DeletePhoneCall(PhoneCall entity);
        PhoneCall GetPhoneCall(Guid Id);

        #endregion


    }
}
