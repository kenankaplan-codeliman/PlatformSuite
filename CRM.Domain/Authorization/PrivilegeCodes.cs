using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Authorization
{
    public static class PrivilegeCodes
    {
        public static class LeadPrivilegeCodes
        {
            public const string Read = "Lead.Read";
            public const string Create = "Lead.Create";
            public const string Update = "Lead.Update";
            public const string Delete = "Lead.Delete";
        }

        public static class CustomerPrivilegeCodes
        {
            public const string Read = "Customer.Read";
            public const string Create = "Customer.Create";
        }
    }

}
