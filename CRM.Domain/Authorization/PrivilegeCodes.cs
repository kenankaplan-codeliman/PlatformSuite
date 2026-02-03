using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Authorization
{
    public static class PrivilegeCodes
    {

        public static class UserPrivilegeCodes
        {
            public const string Read = "User.Read";
            public const string Create = "User.Create";
            public const string Update = "User.Update";
            public const string Delete = "User.Delete";
        }

        public static class LeadPrivilegeCodes
        {
            public const string Read = "Lead.Read";
            public const string Create = "Lead.Create";
            public const string Update = "Lead.Update";
            public const string Delete = "Lead.Delete";
        }

        public static class ActivityPrivilegeCodes
        {
            public const string Read = "Activity.Read";

            public const string AppointmentRead = "Appointment.Read";
            public const string AppointmentCreate = "Appointment.Create";
        }
    }

}
