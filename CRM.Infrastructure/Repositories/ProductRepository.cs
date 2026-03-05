using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Entities.Products;
using CRM.Infrastructure.Data;
using CRM.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Repositories
{
    public class ProductRepository : BaseEntityRepository<Product>, IProductRepository
    {
        

        public ProductRepository(DatabaseContext dbContext) : base(dbContext) { }
        
        
        public override async Task<Product?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
        {
            return await dbContext.Product.FirstOrDefaultAsync(x => x.Id == Id, cancellationToken);
        }
       
    }
}
