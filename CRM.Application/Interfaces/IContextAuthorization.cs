using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces;

public interface IContextAuthorization
{
    public string PrivilegeCode { get;}
    public AccessLevel AccessLevel { get;}
}
