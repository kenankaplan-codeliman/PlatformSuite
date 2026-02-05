
using CRM.Application.CommandHandler;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Application.Modals.Authentication;
using CRM.Domain.Authorization;
using CRM.Domain.Enums;

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

        var requiredPrivilegeCode = attribute.PrivilegeCode;

        bool isValidPrivilegeCode = PrivilegeRegistry.All.Contains(requiredPrivilegeCode);

        if (!isValidPrivilegeCode)
        {
            context.Fail(new AuthorizationFailureReason(this, $"Invalid privilege: {requiredPrivilegeCode}"));
            return;
        }

        try
        {
            var contextUserSrv = httpContext.RequestServices.GetRequiredService<IContextUser>();
            var contextAuthSrv = httpContext.RequestServices.GetRequiredService<IContextAuthorization>();

            contextUserSrv.PrivilegesCodes.TryGetValue(requiredPrivilegeCode, out var accessLevel);

            if (AccessLevel.None.Equals(accessLevel))
            {
                throw new Exception();
            }

            if (contextAuthSrv is ContextAuthorization contextAuth)
            {
                contextAuth.PrivilegeCode = requiredPrivilegeCode;
                contextAuth.AccessLevel = accessLevel;
            }
            else
            {
                throw new Exception();
            }
        }
        catch (Exception ex)
        {
            context.Fail(new AuthorizationFailureReason(this, $"Invalid user context."));
            return;
        }

        context.Succeed(requirement);
    }
}

