using CRM.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Data
{
    public sealed class EfUnitOfWork : IUnitOfWork
    {
        private readonly DatabaseContext dbContext;
        private IDbContextTransaction? transaction;

        public EfUnitOfWork(DatabaseContext context)
        {
            dbContext = context;
        }

        public void BeginTransaction()
        {
            transaction = dbContext.Database.BeginTransaction();
        }

        public void CommitTransaction()
        {
            var hasChanges = dbContext.ChangeTracker
                               .Entries()
                               .Any(e =>
                                   e.State == EntityState.Added ||
                                   e.State == EntityState.Modified ||
                                   e.State == EntityState.Deleted);

            if (hasChanges)
            {
                dbContext.SaveChanges();
            }

            if (transaction != null)
                transaction!.Commit();
        }

        public void RollbackTransaction()
        {
            if (transaction!=null)
                transaction!.Rollback();
        }
    }
}
