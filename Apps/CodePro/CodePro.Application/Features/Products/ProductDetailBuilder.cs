using CodePro.Application.Features.Products.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Products;

internal static class ProductDetailBuilder
{
    public static async Task<ProductDetailItem?> BuildAsync(ICodeProDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var detail = await db.Product.AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new ProductDetailItem
            {
                Id = p.Id,
                Code = p.Code,
                Name = p.Name,
                ShortDescription = p.ShortDescription,
                DetailedDescription = p.DetailedDescription,
                ValidFrom = p.ValidFrom,
                ValidUntil = p.ValidUntil,
                UnitOfMeasure = p.UnitOfMeasure,
                ManufacturerPartNumber = p.ManufacturerPartNumber,
                Model = p.Model,
                Color = p.Color,
                ProductUrl = p.ProductUrl,
                QuantityPerUnit = p.QuantityPerUnit,
                DeliveryDays = p.DeliveryDays,
                AccountCodeId = p.AccountCodeId,
                ProductCategory = db.ProductCategory
                    .Where(c => c.Id == p.ProductCategoryId)
                    .Select(c => new EntityReference(EntityType.None) { Id = c.Id, Name = c.Name })
                    .FirstOrDefault(),
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (detail is null) return null;

        detail.Brands = await (
            from pb in db.ProductBrand.AsNoTracking()
            join b in db.Brand.AsNoTracking() on pb.BrandId equals b.Id
            where pb.ProductId == id
            select new ProductBrandItem { BrandId = b.Id, BrandName = b.Name }
        ).ToListAsync(cancellationToken);

        detail.Manufacturers = await (
            from pm in db.ProductManufacturer.AsNoTracking()
            join m in db.Manufacturer.AsNoTracking() on pm.ManufacturerId equals m.Id
            where pm.ProductId == id
            select new ProductManufacturerItem { ManufacturerId = m.Id, ManufacturerName = m.Name }
        ).ToListAsync(cancellationToken);

        detail.Keywords = await db.ProductKeyword.AsNoTracking()
            .Where(k => k.ProductId == id)
            .Select(k => new ProductKeywordItem { Id = k.Id, Keyword = k.Keyword })
            .ToListAsync(cancellationToken);

        detail.SupplierSkus = await (
            from s in db.ProductSku.AsNoTracking()
            join a in db.Account.AsNoTracking() on s.SupplierAccountId equals a.Id
            where s.ProductId == id
            select new ProductSkuItem
            {
                Id = s.Id,
                SupplierAccount = new EntityReference(EntityType.Account) { Id = a.Id, Name = a.AccountName },
                Sku = s.Sku,
            }
        ).ToListAsync(cancellationToken);

        return detail;
    }
}
