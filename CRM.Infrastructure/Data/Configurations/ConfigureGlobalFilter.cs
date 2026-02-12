
using CRM.Application.Interfaces;
using CRM.Domain.Entities.Common;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Enums;

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
        IContextUser contextUser,
        IContextAuthorization contextAuthorization)
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

                method.Invoke(null, new object[] { modelBuilder, contextUser, contextAuthorization });
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
        IContextUser currentUserContext,
        IContextAuthorization contextAuthorization)
        where TEntity : class, IOwnedEntity
    {
        if (contextAuthorization.AccessLevel == AccessLevel.User)
        {
            builder.Entity<TEntity>()
                .HasQueryFilter(e => e.OwnerId == currentUserContext.UserId);
        }
        else if (contextAuthorization.AccessLevel == AccessLevel.Organization)
        {
            builder.Entity<TEntity>()
                .HasQueryFilter(e =>
                    currentUserContext.AccessibleOrganizationList
                        .Contains(e.OrganizationId));
        }
    }
}
