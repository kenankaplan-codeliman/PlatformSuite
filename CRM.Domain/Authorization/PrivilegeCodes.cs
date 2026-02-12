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

        public static class AccountPrivilegeCodes
        {
            public const string Read = "Account.Read";
            public const string Create = "Account.Create";
            public const string Update = "Account.Update";
            public const string Delete = "Account.Delete";
        }

        public static class ActivityPrivilegeCodes
        {
            public const string Read = "Activity.Read";
            public const string Create = "Activity.Create";
            public const string Update = "Activity.Update";
            public const string Delete = "Activity.Delete";
            public const string UpdateStatus = "Activity.UpdateStatus";

            /*
            public const string AppointmentRead = "Appointment.Read";
            public const string AppointmentCreate = "Appointment.Create";
            public const string AppointmentUpdate = "Appointment.Update";
            public const string AppointmentDelete = "Appointment.Delete";

            public const string PhoneCallRead = "PhoneCall.Read";
            public const string PhoneCallCreate = "PhoneCall.Create";
            public const string PhoneCallUpdate = "PhoneCall.Update";
            public const string PhoneCallDelete = "PhoneCall.Delete";

            public const string TaskRead = "Task.Read";
            public const string TaskCreate = "Task.Create";
            public const string TaskUpdate = "Task.Update";
            public const string TaskDelete = "Task.Delete";

            public const string EmailRead = "Email.Read";
            public const string EmailCreate = "Email.Create";
            public const string EmailUpdate = "Email.Update";
            public const string EmailDelete = "Email.Delete";
            */

        }
    }

}
