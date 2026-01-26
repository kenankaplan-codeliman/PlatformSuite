using CRM.Application.Authentication.Interfaces;
using CRM.Domain.Entities.Common;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace CRM.Infrastructure.Data.Configurations;

public static class ConfigureGlobalFilter
{
    public static void SetGlobalFilter(
        this ModelBuilder modelBuilder,
        ICurrentUserContext currentUserContext)
    {
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            if (entity.BaseType != null)
                continue;

            if (typeof(ISoftDeleteEntity).IsAssignableFrom(entity.ClrType))
            {
                var method = typeof(ConfigureGlobalFilter)
                    .GetMethod(nameof(ApplySoftDeleteEntityFilter),
                        BindingFlags.NonPublic | BindingFlags.Static)!
                    .MakeGenericMethod(entity.ClrType);

                method.Invoke(null, new object[] { modelBuilder });

            }

            if (typeof(IOwnedEntity).IsAssignableFrom(entity.ClrType))
            {
                var method = typeof(ConfigureGlobalFilter)
                    .GetMethod(nameof(ApplyOwnedEntityFilter),
                        BindingFlags.NonPublic | BindingFlags.Static)!
                    .MakeGenericMethod(entity.ClrType);

                method.Invoke(null, new object[] { modelBuilder, currentUserContext });
            }
        }
    }

    

    private static void ApplySoftDeleteEntityFilter<TEntity>(
        ModelBuilder builder)
        where TEntity : class, ISoftDeleteEntity
    {
        builder.Entity<TEntity>()
            .HasQueryFilter(e => !e.IsDeleted);
    }

    private static void ApplyOwnedEntityFilter<TEntity>(
        ModelBuilder builder,
        ICurrentUserContext currentUserContext)
        where TEntity : class, IOwnedEntity
    {
        if (currentUserContext.AccessLevel == AccessLevel.User)
        {
            builder.Entity<TEntity>()
                .HasQueryFilter(e => e.OwnerId == currentUserContext.UserId);
        }
        else if (currentUserContext.AccessLevel == AccessLevel.Organization)
        {
            builder.Entity<TEntity>()
                .HasQueryFilter(e =>
                    currentUserContext.AccessibleOrganizationList
                        .Contains(e.OrganizationId));
        }
    }
}
