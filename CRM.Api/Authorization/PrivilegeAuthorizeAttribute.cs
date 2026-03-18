using System;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace CRM.Api.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public sealed class PrivilegeAuthorizeAttribute  : AuthorizeAttribute
{
    public List<string> PrivilegeCodes { get; } = new();

    public PrivilegeAuthorizeAttribute(params string[] privilegeCodes)
    {
        Policy = nameof(PrivilegeAuthorizationRequirement);
        PrivilegeCodes.AddRange(privilegeCodes.ToList());
    }
}
