using CRM.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IRepository<T>
    {
        Task<T?> GetAsync(Guid Id);
        Task UpdateAsync(T entity);
        Task CreateAsync(T entity);
        Task DeleteAsync(T entity);
    }
}
