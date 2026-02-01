using CRM.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IEntityRepository<T>
    {
        Task<T?> GetAsync(Guid Id);
        Task<T> UpdateAsync(T entity);
        Task<T> CreateAsync(T entity);
        Task<T> DeleteAsync(T entity);
    }
}
