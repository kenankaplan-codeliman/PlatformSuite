using CRM.Application.Authentication.Interfaces;
using CRM.Application.CommandHandler;
using CRM.Application.Interfaces;
using CRM.Domain.Authorization;
using CRM.Domain.Enums;
using CRM.Infrastructure.Model;
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

        var currentUserContext = httpContext.RequestServices.GetRequiredService<ICurrentUserContext>();
        if (currentUserContext is CurrentUserContext user)
        {

            var accessLevel = await userRepository.GetAccessLevel(user.UserId, requiredPrivilegeCode);

            if (AccessLevel.None.Equals(accessLevel))
            {
                context.Fail(new AuthorizationFailureReason(this, $"Missing privilege: {requiredPrivilegeCode}"));
                return;
            }

            user.AccessLevel = accessLevel;
        }
        else
        {
            context.Fail(new AuthorizationFailureReason(this, $"Invalid user context."));
            return;
        }

        context.Succeed(requirement);
    }
}

