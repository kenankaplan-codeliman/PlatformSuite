using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Authorization
{
    public static class PrivilegeCodes
    {
        public static class Lead
        {
            public const string Read = "Lead.Read";
            public const string Create = "Lead.Create";
        }

        public static class Customer
        {
            public const string Read = "Customer.Read";
            public const string Create = "Customer.Create";
        }
    }

}
