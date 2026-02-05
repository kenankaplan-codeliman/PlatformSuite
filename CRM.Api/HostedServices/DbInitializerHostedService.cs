using System;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CRM.Api.HostedServices;

public sealed class DbInitializerHostedService : IHostedService
{
    
    private readonly IWebHostEnvironment _env;

    private readonly IServiceScopeFactory _scopeFactory;

    public DbInitializerHostedService(IServiceScopeFactory scopeFactory, IWebHostEnvironment env)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

        //Privileges
        ValueInitialize.validatePrivileges(dbContext);

        //Organization
        var defOrganizationId = ValueInitialize.validateDefaultOrganization(dbContext);

        //Roles
        var defaultRoleId = ValueInitialize.validateRole(dbContext, "Personal", AccessLevel.User, isDefault: true);
        var defaultManagerRoleId = ValueInitialize.validateRole(dbContext, "Manager", AccessLevel.Organization);
        var defaultAdminRoleId = ValueInitialize.validateRole(dbContext, "Administrator", AccessLevel.All);

        //User
        ValueInitialize.CreateAdminUser(dbContext, defOrganizationId, defaultAdminRoleId);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

