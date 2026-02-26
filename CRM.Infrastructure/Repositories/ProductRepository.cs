using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Domain.Entities.Products;
using CRM.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly DatabaseContext dbContext;

        public ProductRepository(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public Product Get(Guid Id)
        {
            return dbContext.Product.FirstOrDefault(x => x.Id == Id) ?? throw new NotFoundException();
        }

        public Product Create(Product entity)
        {
            var entry = this.dbContext.Product.Add(entity);
            return entry.Entity;
        }

        public Product Delete(Product entity)
        {
            var entry = this.dbContext.Product.Remove(entity);
            return entry.Entity;
        }

        

        public Product Update(Product entity)
        {
            var entry = this.dbContext.Product.Update(entity);
            return entry.Entity;
        }
    }
}
