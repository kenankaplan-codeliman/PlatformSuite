using CodePro.Application.Features.ProductCatalogs.Dtos;
using CodePro.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductCatalogs;

internal static class ProductCatalogDetailBuilder
{
    public static async Task<ProductCatalogDetailItem?> BuildAsync(ICodeProDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var detail = await db.ProductCatalog.AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new ProductCatalogDetailItem
            {
                Id = c.Id,
                Code = c.Code,
                Name = c.Name,
                Description = c.Description,
                ValidFrom = c.ValidFrom,
                ValidUntil = c.ValidUntil,
                PriceCode = c.PriceCode,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return null;

        detail.Products = await (
            from cp in db.ProductCatalogProduct.AsNoTracking()
            join p in db.Product.AsNoTracking() on cp.ProductId equals p.Id
            where cp.ProductCatalogId == id
            select new ProductCatalogProductItem
            {
                ProductId = p.Id,
                ProductCode = p.Code,
                ProductName = p.Name,
            }
        ).ToListAsync(cancellationToken);

        detail.Organizations = await (
            from co in db.ProductCatalogOrganization.AsNoTracking()
            join o in db.AppOrganization.AsNoTracking() on co.AppOrganizationId equals o.Id
            where co.ProductCatalogId == id
            select new ProductCatalogOrganizationItem
            {
                AppOrganizationId = o.Id,
                OrganizationName = o.OrganizationName,
            }
        ).ToListAsync(cancellationToken);

        return detail;
    }
}
