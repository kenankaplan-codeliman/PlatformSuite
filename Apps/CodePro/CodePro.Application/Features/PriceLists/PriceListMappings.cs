using CodePro.Application.Features.PriceLists.Commands.CreatePriceList;
using CodePro.Application.Features.PriceLists.Commands.UpdatePriceList;
using CodePro.Application.Features.PriceLists.Dtos;
using CodePro.Domain.Entities.Products;
using Platform.Application.Modals.Common;
using CodePro.Domain.Entities.Suppliers;
using Platform.Application.Mapping;
using Mapster;

namespace CodePro.Application.Features.PriceLists;

public static class PriceListMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<PriceList, PriceListDetailItem>()
            .Map(d => d.Supplier, s => s.Supplier != null
                ? new EntityReference(nameof(Supplier))
                {
                    Id = s.Supplier.Id,
                    Name = s.Supplier.Name,
                }
                : null);

        config.NewConfig<PriceList, PriceListListItem>();

        config.NewConfig<CreatePriceListCommand, PriceList>()
            .Map(d => d.SupplierId, s => s.Supplier != null ? s.Supplier.Id : Guid.Empty)
            .Ignore(d => d.Supplier!,
                    d => d.Prices)
            .IgnoreAuditFields();

        config.NewConfig<UpdatePriceListCommand, PriceList>()
            .IgnoreNullValues(true)
            .Map(d => d.SupplierId, s => s.Supplier != null ? s.Supplier.Id : Guid.Empty)
            .Ignore(d => d.Supplier!,
                    d => d.Prices)
            .IgnoreAuditFields();
    }
}
