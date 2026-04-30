using Platform.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Infrastructure.Data
{
    public sealed class UnitOfWork : IUnitOfWork
    {
        private readonly PlatformDbContext dbContext;
        private IDbContextTransaction? transaction;

        public UnitOfWork(PlatformDbContext context)
        {
            dbContext = context;
        }

        public async Task BeginTransactionAsync()
        {
            transaction = await dbContext.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            var hasChanges = dbContext.ChangeTracker
                               .Entries()
                               .Any(e =>
                                   e.State == EntityState.Added ||
                                   e.State == EntityState.Modified ||
                                   e.State == EntityState.Deleted);

            if (hasChanges)
            {
                await dbContext.SaveChangesAsync();
            }

            if (transaction != null)
                await transaction!.CommitAsync();
        }

        public async Task RollbackTransactionAsync()
        {
            if (transaction!=null)
                await transaction!.RollbackAsync();
        }
    }
}
