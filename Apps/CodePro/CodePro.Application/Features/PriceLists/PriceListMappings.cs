using CodePro.Application.Features.PriceLists.Commands.CreatePriceList;
using CodePro.Application.Features.PriceLists.Commands.UpdatePriceList;
using CodePro.Application.Features.PriceLists.Dtos;
using CodePro.Domain.Entities.Products;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using Mapster;

namespace CodePro.Application.Features.PriceLists;

public static class PriceListMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<PriceList, PriceListDetailItem>()
            .Map(d => d.SupplierAccount, s => s.SupplierAccount != null
                ? new EntityReference(EntityType.Account)
                {
                    Id = s.SupplierAccount.Id,
                    Name = s.SupplierAccount.AccountName,
                }
                : null);

        config.NewConfig<PriceList, PriceListListItem>();

        config.NewConfig<CreatePriceListCommand, PriceList>()
            .Map(d => d.SupplierAccountId, s => s.SupplierAccount != null ? s.SupplierAccount.Id : Guid.Empty)
            .Ignore(d => d.Id,
                    d => d.SupplierAccount!,
                    d => d.Prices,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdatePriceListCommand, PriceList>()
            .IgnoreNullValues(true)
            .Map(d => d.SupplierAccountId, s => s.SupplierAccount != null ? s.SupplierAccount.Id : Guid.Empty)
            .Ignore(d => d.Id,
                    d => d.SupplierAccount!,
                    d => d.Prices,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
