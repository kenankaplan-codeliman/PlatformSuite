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
        public static class ActivityPrivilegeCodes
        {
            public const string Read = "Activity.Read";
            public const string Create = "Activity.Create";
            public const string Update = "Activity.Update";
            public const string Delete = "Activity.Delete";
            public const string UpdateStatus = "Activity.UpdateStatus";
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

        public static class ContactPrivilegeCodes
        {
            public const string Read = "Contact.Read";
            public const string Create = "Contact.Create";
            public const string Update = "Contact.Update";
            public const string Delete = "Contact.Delete";
        }

        public static class OpportunityPrivilegeCodes
        {
            public const string Read = "Opportunity.Read";
            public const string Create = "Opportunity.Create";
            public const string Update = "Opportunity.Update";
            public const string Delete = "Opportunity.Delete";
        }


    }

}
