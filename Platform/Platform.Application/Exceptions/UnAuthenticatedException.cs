using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Exceptions
{
    public class UnAuthenticatedException : Exception
    {
        public UnAuthenticatedException(string message) : base(message) { }
    }
}
