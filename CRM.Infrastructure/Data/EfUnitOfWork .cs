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
        private readonly DatabaseContext _context;
        private IDbContextTransaction? _transaction;

        public EfUnitOfWork(DatabaseContext context)
        {
            _context = context;
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync()
        {
            var hasChanges = _context.ChangeTracker
                               .Entries()
                               .Any(e =>
                                   e.State == EntityState.Added ||
                                   e.State == EntityState.Modified ||
                                   e.State == EntityState.Deleted);

            if (hasChanges)
            {
                await _context.SaveChangesAsync();
            }

            await _transaction!.CommitAsync();
        }

        public async Task RollbackAsync()
        {
            await _transaction!.RollbackAsync();
        }
    }
}
