using CodePro.Domain.Entities.Products;

namespace CodePro.Application.Interfaces;

/// <summary>
/// ProductImage için yazma yolu (Command path). Query'ler ICodeProDbContext
/// üzerinden projection ile çalışır; bu repository sadece state mutasyonları için.
/// </summary>
public interface IProductImageRepository
{
    Task<ProductImage?> GetAsync(Guid id, CancellationToken cancellationToken = default);

    Task<List<ProductImage>> GetByProductAsync(Guid productId, CancellationToken cancellationToken = default);

    Task<bool> HasAnyAsync(Guid productId, CancellationToken cancellationToken = default);

    Task<ProductImage> CreateAsync(ProductImage image, CancellationToken cancellationToken = default);

    Task DeleteAsync(ProductImage image, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
