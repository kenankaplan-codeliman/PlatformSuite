using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCatalogs;

internal static class ProductCatalogSyncHelper
{
    public static async Task SyncProductsAsync(
        ICodeProDbContext db, Guid catalogId, IReadOnlyList<Guid> productIds, CancellationToken cancellationToken)
    {
        var existing = await db.ProductCatalogProduct
            .Where(p => p.ProductCatalogId == catalogId)
            .ToListAsync(cancellationToken);

        var desired = productIds.ToHashSet();
        var existingIds = existing.Select(e => e.ProductId).ToHashSet();

        var toRemove = existing.Where(e => !desired.Contains(e.ProductId)).ToList();
        if (toRemove.Count > 0) db.ProductCatalogProduct.RemoveRange(toRemove);

        var toAdd = productIds
            .Where(id => !existingIds.Contains(id))
            .Select(id => new ProductCatalogProduct { ProductCatalogId = catalogId, ProductId = id })
            .ToList();
        if (toAdd.Count > 0) db.ProductCatalogProduct.AddRange(toAdd);
    }

    public static async Task SyncOrganizationsAsync(
        ICodeProDbContext db, Guid catalogId, IReadOnlyList<Guid> organizationIds, CancellationToken cancellationToken)
    {
        var existing = await db.ProductCatalogOrganization
            .Where(o => o.ProductCatalogId == catalogId)
            .ToListAsync(cancellationToken);

        var desired = organizationIds.ToHashSet();
        var existingIds = existing.Select(e => e.AppOrganizationId).ToHashSet();

        var toRemove = existing.Where(e => !desired.Contains(e.AppOrganizationId)).ToList();
        if (toRemove.Count > 0) db.ProductCatalogOrganization.RemoveRange(toRemove);

        var toAdd = organizationIds
            .Where(id => !existingIds.Contains(id))
            .Select(id => new ProductCatalogOrganization { ProductCatalogId = catalogId, AppOrganizationId = id })
            .ToList();
        if (toAdd.Count > 0) db.ProductCatalogOrganization.AddRange(toAdd);
    }
}
