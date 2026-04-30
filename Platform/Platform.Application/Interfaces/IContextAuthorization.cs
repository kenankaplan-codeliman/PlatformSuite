using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces;

public interface IContextAuthorization
{
    public string PrivilegeCode { get;}
    public AccessLevel AccessLevel { get;}
}
