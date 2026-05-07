using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using CodePro.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public sealed class ProductImageRepository : IProductImageRepository
{
    private readonly CodeProDbContext _db;

    public ProductImageRepository(CodeProDbContext db) => _db = db;

    public Task<ProductImage?> GetAsync(Guid id, CancellationToken cancellationToken = default)
        => _db.ProductImage.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

    public async Task<List<ProductImage>> GetByProductAsync(Guid productId, CancellationToken cancellationToken = default)
        => await _db.ProductImage
            .Where(i => i.ProductId == productId)
            .OrderBy(i => i.SortOrder)
            .ThenBy(i => i.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<bool> HasAnyAsync(Guid productId, CancellationToken cancellationToken = default)
        => await _db.ProductImage.AnyAsync(i => i.ProductId == productId, cancellationToken);

    public async Task<ProductImage> CreateAsync(ProductImage image, CancellationToken cancellationToken = default)
    {
        await _db.ProductImage.AddAsync(image, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
        return image;
    }

    public async Task DeleteAsync(ProductImage image, CancellationToken cancellationToken = default)
    {
        _db.ProductImage.Remove(image);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
        => _db.SaveChangesAsync(cancellationToken);
}
