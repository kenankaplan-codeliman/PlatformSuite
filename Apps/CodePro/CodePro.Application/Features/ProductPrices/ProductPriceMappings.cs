using CodePro.Application.Features.ProductPrices.Commands.CreateProductPrice;
using CodePro.Application.Features.ProductPrices.Commands.UpdateProductPrice;
using CodePro.Application.Features.ProductPrices.Dtos;
using CodePro.Domain.Entities.Products;
using Platform.Application.Modals.Common;
using CodePro.Domain.Entities.Suppliers;
using Mapster;

namespace CodePro.Application.Features.ProductPrices;

public static class ProductPriceMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ProductPrice, ProductPriceDetailItem>()
            .Map(d => d.Product, s => s.Product != null
                ? new EntityReference(nameof(Product)) { Id = s.Product.Id, Name = s.Product.Name }
                : null)
            .Map(d => d.Supplier, s => s.Supplier != null
                ? new EntityReference(nameof(Supplier)) { Id = s.Supplier.Id, Name = s.Supplier.Name }
                : null)
            .Map(d => d.PriceList, s => s.PriceList != null
                ? new EntityReference(nameof(PriceList)) { Id = s.PriceList.Id, Name = s.PriceList.Name }
                : null);

        config.NewConfig<CreateProductPriceCommand, ProductPrice>()
            .Map(d => d.ProductId, s => s.Product != null ? s.Product.Id : Guid.Empty)
            .Map(d => d.SupplierId, s => s.Supplier != null ? s.Supplier.Id : Guid.Empty)
            .Map(d => d.PriceListId, s => s.PriceList != null ? (Guid?)s.PriceList.Id : null)
            .Ignore(d => d.Id,
                    d => d.Product!, d => d.Supplier!, d => d.PriceList!,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateProductPriceCommand, ProductPrice>()
            .IgnoreNullValues(true)
            .Map(d => d.ProductId, s => s.Product != null ? s.Product.Id : Guid.Empty)
            .Map(d => d.SupplierId, s => s.Supplier != null ? s.Supplier.Id : Guid.Empty)
            .Ignore(d => d.PriceListId)
            .Ignore(d => d.Id,
                    d => d.Product!, d => d.Supplier!, d => d.PriceList!,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt)
            .AfterMapping((src, dst) =>
            {
                dst.PriceListId = src.PriceList?.Id;
            });
    }
}
