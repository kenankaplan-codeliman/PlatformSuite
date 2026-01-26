using System;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace CRM.Api.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public sealed class PrivilegeAuthorizeAttribute  : AuthorizeAttribute
{
    public string PrivilegeCode { get; }

    public PrivilegeAuthorizeAttribute(string privilegeCode)
    {
        Policy = nameof(PrivilegeAuthorizationRequirement);
        PrivilegeCode = privilegeCode;
    }
}
