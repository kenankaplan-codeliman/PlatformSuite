using CRM.Domain.Entities.Activity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IAppointmentRepository : IEntityRepository<Appointment>
    {
    }
}
