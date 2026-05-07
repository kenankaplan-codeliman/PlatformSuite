using CodePro.Application.Features.ProductPrices.Commands.CreateProductPrice;
using CodePro.Application.Features.ProductPrices.Commands.UpdateProductPrice;
using CodePro.Application.Features.ProductPrices.Dtos;
using CodePro.Domain.Entities.Products;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using Mapster;

namespace CodePro.Application.Features.ProductPrices;

public static class ProductPriceMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ProductPrice, ProductPriceDetailItem>()
            .Map(d => d.Product, s => s.Product != null
                ? new EntityReference(EntityType.None) { Id = s.Product.Id, Name = s.Product.Name }
                : null)
            .Map(d => d.SupplierAccount, s => s.SupplierAccount != null
                ? new EntityReference(EntityType.Account) { Id = s.SupplierAccount.Id, Name = s.SupplierAccount.AccountName }
                : null)
            .Map(d => d.PriceList, s => s.PriceList != null
                ? new EntityReference(EntityType.None) { Id = s.PriceList.Id, Name = s.PriceList.Name }
                : null);

        config.NewConfig<CreateProductPriceCommand, ProductPrice>()
            .Map(d => d.ProductId, s => s.Product != null ? s.Product.Id : Guid.Empty)
            .Map(d => d.SupplierAccountId, s => s.SupplierAccount != null ? s.SupplierAccount.Id : Guid.Empty)
            .Map(d => d.PriceListId, s => s.PriceList != null ? (Guid?)s.PriceList.Id : null)
            .Ignore(d => d.Id,
                    d => d.Product!, d => d.SupplierAccount!, d => d.PriceList!,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateProductPriceCommand, ProductPrice>()
            .IgnoreNullValues(true)
            .Map(d => d.ProductId, s => s.Product != null ? s.Product.Id : Guid.Empty)
            .Map(d => d.SupplierAccountId, s => s.SupplierAccount != null ? s.SupplierAccount.Id : Guid.Empty)
            .Ignore(d => d.PriceListId)
            .Ignore(d => d.Id,
                    d => d.Product!, d => d.SupplierAccount!, d => d.PriceList!,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt)
            .AfterMapping((src, dst) =>
            {
                dst.PriceListId = src.PriceList?.Id;
            });
    }
}
