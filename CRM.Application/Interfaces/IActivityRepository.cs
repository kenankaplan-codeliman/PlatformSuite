using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ActivityModal;
using CRM.Domain.Entities.Lead;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IActivityRepository
    {
        PaginationResult<ActivityBaseModal> List(ActivityListFilters? filter, PaginationInfo? paginationInfo);

        AppointmentActivityModal CreateAppointment(ActivityListFilters? filter, PaginationInfo? paginationInfo);

    }
}
