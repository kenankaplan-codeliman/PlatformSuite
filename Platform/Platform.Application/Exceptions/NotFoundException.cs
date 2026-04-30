using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string message = "Record not found.") : base(message)
        {
        }
    }
}
