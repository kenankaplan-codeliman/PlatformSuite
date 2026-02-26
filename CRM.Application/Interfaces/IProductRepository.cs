using CRM.Domain.Entities.Opportunities;
using CRM.Domain.Entities.Products;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IProductRepository : IEntityRepository<Product>
    {
    }
}
