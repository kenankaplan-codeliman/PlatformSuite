using System;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CRM.Api.HostedServices;

public sealed class DbInitializerHostedService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IWebHostEnvironment _env;

    public DbInitializerHostedService(
        IServiceProvider serviceProvider,
        IWebHostEnvironment env)
    {
        _serviceProvider = serviceProvider;
        _env = env;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

        //Privileges
        await ValueInitialize.validatePrivileges(dbContext);

        //Organization
        var defOrganizationId = await ValueInitialize.validateDefaultOrganization(dbContext);

        //Roles
        var defaultRoleId = await ValueInitialize.validateRole(dbContext, "Personal", AccessLevel.User, isDefault: true);
        var defaultManagerRoleId = await ValueInitialize.validateRole(dbContext, "Manager", AccessLevel.Organization);
        var defaultAdminRoleId = await ValueInitialize.validateRole(dbContext, "Administrator", AccessLevel.All);

        //User
        await ValueInitialize.CreateAdminUser(dbContext, defOrganizationId, defaultAdminRoleId);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

