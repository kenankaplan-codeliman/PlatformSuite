using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Products;

internal static class ProductSyncHelper
{
    public static async Task SyncBrandsAsync(
        ICodeProDbContext db, Guid productId, IReadOnlyList<Guid> brandIds, CancellationToken cancellationToken)
    {
        var existing = await db.ProductBrand
            .Where(pb => pb.ProductId == productId)
            .ToListAsync(cancellationToken);

        var desired = brandIds.ToHashSet();
        var existingIds = existing.Select(e => e.BrandId).ToHashSet();

        var toRemove = existing.Where(e => !desired.Contains(e.BrandId)).ToList();
        if (toRemove.Count > 0) db.ProductBrand.RemoveRange(toRemove);

        var toAdd = brandIds
            .Where(id => !existingIds.Contains(id))
            .Select(id => new ProductBrand { ProductId = productId, BrandId = id })
            .ToList();
        if (toAdd.Count > 0) db.ProductBrand.AddRange(toAdd);
    }

    public static async Task SyncManufacturersAsync(
        ICodeProDbContext db, Guid productId, IReadOnlyList<Guid> manufacturerIds, CancellationToken cancellationToken)
    {
        var existing = await db.ProductManufacturer
            .Where(pm => pm.ProductId == productId)
            .ToListAsync(cancellationToken);

        var desired = manufacturerIds.ToHashSet();
        var existingIds = existing.Select(e => e.ManufacturerId).ToHashSet();

        var toRemove = existing.Where(e => !desired.Contains(e.ManufacturerId)).ToList();
        if (toRemove.Count > 0) db.ProductManufacturer.RemoveRange(toRemove);

        var toAdd = manufacturerIds
            .Where(id => !existingIds.Contains(id))
            .Select(id => new ProductManufacturer { ProductId = productId, ManufacturerId = id })
            .ToList();
        if (toAdd.Count > 0) db.ProductManufacturer.AddRange(toAdd);
    }

    public static async Task SyncKeywordsAsync(
        ICodeProDbContext db, Guid productId, IReadOnlyList<string> keywords, CancellationToken cancellationToken)
    {
        var existing = await db.ProductKeyword
            .Where(k => k.ProductId == productId)
            .ToListAsync(cancellationToken);

        var desired = keywords
            .Select(k => k.Trim())
            .Where(k => !string.IsNullOrEmpty(k))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var desiredSet = new HashSet<string>(desired, StringComparer.OrdinalIgnoreCase);
        var existingSet = new HashSet<string>(existing.Select(e => e.Keyword), StringComparer.OrdinalIgnoreCase);

        var toRemove = existing.Where(e => !desiredSet.Contains(e.Keyword)).ToList();
        if (toRemove.Count > 0) db.ProductKeyword.RemoveRange(toRemove);

        var toAdd = desired
            .Where(k => !existingSet.Contains(k))
            .Select(k => new ProductKeyword { ProductId = productId, Keyword = k })
            .ToList();
        if (toAdd.Count > 0) db.ProductKeyword.AddRange(toAdd);
    }

    public static async Task SyncSupplierSkusAsync(
        ICodeProDbContext db,
        Guid productId,
        IReadOnlyList<ProductSkuInput> incoming,
        CancellationToken cancellationToken)
    {
        var existing = await db.ProductSku
            .Where(s => s.ProductId == productId)
            .ToListAsync(cancellationToken);

        var desiredBySupplier = incoming
            .Where(s => s.SupplierAccountId != Guid.Empty && !string.IsNullOrWhiteSpace(s.Sku))
            .GroupBy(s => s.SupplierAccountId)
            .ToDictionary(g => g.Key, g => g.First().Sku.Trim());

        var existingBySupplier = existing.ToDictionary(e => e.SupplierAccountId, e => e);

        var toRemove = existing.Where(e => !desiredBySupplier.ContainsKey(e.SupplierAccountId)).ToList();
        if (toRemove.Count > 0) db.ProductSku.RemoveRange(toRemove);

        foreach (var (supplierId, sku) in desiredBySupplier)
        {
            if (existingBySupplier.TryGetValue(supplierId, out var current))
            {
                if (current.Sku != sku) current.Sku = sku;
            }
            else
            {
                db.ProductSku.Add(new ProductSku
                {
                    ProductId = productId,
                    SupplierAccountId = supplierId,
                    Sku = sku,
                });
            }
        }
    }
}

public sealed class ProductSkuInput
{
    public Guid SupplierAccountId { get; init; }
    public string Sku { get; init; } = string.Empty;
}
