using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IEntityRepository<T>
    {
        T Get(Guid Id);
        T Update(T entity);
        T Create(T entity);
        T Delete(T entity);


    }
}
