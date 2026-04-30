using CodePro.Domain.Entities.Products;
using Platform.Application.Interfaces;

namespace CodePro.Application.Interfaces;

public interface IProductCatalogRepository : IEntityRepository<ProductCatalog>
{
}
