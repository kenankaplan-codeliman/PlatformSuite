using Crm.Domain.Entities.Products;
using Platform.Application.Interfaces;

namespace Crm.Application.Interfaces;

public interface IProductRepository : IEntityRepository<Product>
{
    // List/Search sorguları ICrmDbContext + Mapster projection üzerinden query handler'da.
    // Write path metotları (Create/Update/Delete/SetState/GetAsync) IEntityRepository'den.
}
