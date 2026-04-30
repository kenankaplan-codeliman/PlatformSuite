using CodePro.Application.Features.ProductPrices.Commands.CreateProductPrice;
using CodePro.Application.Features.ProductPrices.Commands.UpdateProductPrice;
using CodePro.Application.Features.ProductPrices.Dtos;
using CodePro.Domain.Entities.Products;
using Mapster;

namespace CodePro.Application.Features.ProductPrices;

public static class ProductPriceMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ProductPrice, ProductPriceDetailItem>()
            .Map(d => d.ProductName, s => s.Product != null ? s.Product.Name : null)
            .Map(d => d.SupplierAccountName, s => s.SupplierAccount != null ? s.SupplierAccount.AccountName : null)
            .Map(d => d.PriceListName, s => s.PriceList != null ? s.PriceList.Name : null);

        config.NewConfig<CreateProductPriceCommand, ProductPrice>()
            .Ignore(d => d.Id,
                    d => d.Product!, d => d.SupplierAccount!, d => d.PriceList!,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateProductPriceCommand, ProductPrice>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.Product!, d => d.SupplierAccount!, d => d.PriceList!,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
