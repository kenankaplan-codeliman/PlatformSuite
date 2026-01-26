using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Exceptions
{
    public class UnAuthorizedException : Exception
    {
        public UnAuthorizedException(string message) : base(message) { }
    }
}
