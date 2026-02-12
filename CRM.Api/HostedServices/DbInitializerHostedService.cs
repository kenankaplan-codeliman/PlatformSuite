using CRM.Application.Interfaces;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace CRM.Api.HostedServices;

public sealed class DbInitializerHostedService : IHostedService
{
    
    private readonly IWebHostEnvironment _env;

    private readonly IServiceScopeFactory _scopeFactory;

    public DbInitializerHostedService(IServiceScopeFactory scopeFactory, IWebHostEnvironment env)
    {
        _scopeFactory = scopeFactory;
        _env = env;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();

        IConfiguration configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        IRoleRepository roleRepository = scope.ServiceProvider.GetRequiredService<IRoleRepository>();
        IUserRepository userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();

        //Privileges
        await roleRepository.CreatePrivileges();


        //Roles
        var defaultRole = await roleRepository.GetOrCreateAsync(configuration["DefaultValues:Default_User_Role"]!, AccessLevel.User, isDefault: true);
        var defaultManagerRole = await roleRepository.GetOrCreateAsync(configuration["DefaultValues:Default_Manager_Role"]!, AccessLevel.Organization);
        var defaultAdminRole = await roleRepository.GetOrCreateAsync(configuration["DefaultValues:Default_Admin_Role"]!, AccessLevel.All);

        //User
        string adminUserEmail = configuration["DefaultValues:Admin_User_Email"]!;
        string adminUserPassword = configuration["DefaultValues:Admin_User_Password"]!;
        string adminFirstName = configuration["DefaultValues:Admin_Firs_tName"]!;
        string adminLastName = configuration["DefaultValues:Admin_Last_Name"]!;

        var user = await userRepository.GetOrCreateAsync(adminUserEmail, adminFirstName, adminLastName, password: adminUserPassword, roleIds:new List<Guid>() { defaultAdminRole.Id });
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

