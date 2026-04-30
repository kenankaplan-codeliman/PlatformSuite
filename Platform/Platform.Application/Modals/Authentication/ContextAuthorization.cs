using Platform.Application.Interfaces;
using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Modals.Authentication;

public class ContextAuthorization : IContextAuthorization
{
    public string PrivilegeCode { get; set; } = default!;
    public AccessLevel AccessLevel { get; set; }
}
