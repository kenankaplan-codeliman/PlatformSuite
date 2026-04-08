
using CRM.Application.CommandHandler;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Application.Modals.Authentication;
using CRM.Domain.Authorization;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using System;

namespace CRM.Api.Authorization;

public class PrivilegeAuthorizationHandler : AuthorizationHandler<PrivilegeAuthorizationRequirement>
{
    private readonly IUserRepository userRepository;

    public PrivilegeAuthorizationHandler(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PrivilegeAuthorizationRequirement requirement)
    {
        if (context.Resource is not HttpContext httpContext)
            return;

        var endpoint = httpContext.GetEndpoint();

        var attribute = endpoint?.Metadata.GetMetadata<PrivilegeAuthorizeAttribute>();

        // Attribute yoksa public endpoint
        if (attribute is null)
        {
            context.Succeed(requirement);
            return;
        }

        if (context.User.Identity?.IsAuthenticated == false)
        {
            context.Fail(new AuthorizationFailureReason(this, "User is not authenticated."));
            return;
        }

        var requiredPrivilegeCodes = attribute.PrivilegeCodes;

        bool isValidPrivilegeCode = requiredPrivilegeCodes.All(code => PrivilegeRegistry.All.Contains(code));

        if (!isValidPrivilegeCode)
        {
            context.Fail(new AuthorizationFailureReason(this, "Invalid privilege code"));
            return;
        }

        try
        {
            var contextUserSrv = httpContext.RequestServices.GetRequiredService<IContextUser>();
            var contextAuthSrv = httpContext.RequestServices.GetRequiredService<IContextAuthorization>();


            var matchedPrivileges = requiredPrivilegeCodes
                                    .Where(code => contextUserSrv.PrivilegesCodes.ContainsKey(code))
                                    .ToList();

            if (!matchedPrivileges.Any())
            {
                context.Fail(new AuthorizationFailureReason(
                    this,
                    $"User does not have any of required privileges: {string.Join(", ", requiredPrivilegeCodes)}"
                ));
                return;
            }

            var bestPrivilege = requiredPrivilegeCodes
                .Where(code => contextUserSrv.PrivilegesCodes.ContainsKey(code))
                .Select(code => new
                {
                    Code = code,
                    Level = contextUserSrv.PrivilegesCodes[code]
                })
                .OrderByDescending(x => x.Level)
                .First();

            if (bestPrivilege.Level == AccessLevel.None)
            {
                context.Fail(new AuthorizationFailureReason(this, $"User has privilege but no access level"));
                return;
            }

            if (contextAuthSrv is ContextAuthorization contextAuth)
            {
                contextAuth.PrivilegeCode = bestPrivilege.Code;
                contextAuth.AccessLevel = bestPrivilege.Level;
            }
            else
            {
                throw new Exception();
            }
        }
        catch (Exception)
        {
            context.Fail(new AuthorizationFailureReason(this, $"Invalid user context."));
            return;
        }

        context.Succeed(requirement);
    }
}

