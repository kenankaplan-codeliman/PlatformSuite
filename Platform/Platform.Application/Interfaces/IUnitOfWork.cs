using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface IUnitOfWork
    {
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
