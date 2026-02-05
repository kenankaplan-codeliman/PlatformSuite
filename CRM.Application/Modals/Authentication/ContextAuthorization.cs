using CRM.Application.Interfaces;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.Authentication;

public class ContextAuthorization : IContextAuthorization
{
    public string PrivilegeCode { get; set; } = string.Empty;
    public AccessLevel AccessLevel { get; set; } = AccessLevel.None;
}
