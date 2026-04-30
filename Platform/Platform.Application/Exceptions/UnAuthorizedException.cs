using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Exceptions
{
    public class UnAuthorizedException : Exception
    {
        public UnAuthorizedException(string message) : base(message) { }
    }
}
