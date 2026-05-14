using CodePro.Application.Features.Suppliers.Commands.CreateSupplier;
using CodePro.Application.Features.Suppliers.Commands.UpdateSupplier;
using CodePro.Application.Features.Suppliers.Dtos;
using CodePro.Domain.Entities.Suppliers;
using Platform.Application.Mapping;
using Mapster;

namespace CodePro.Application.Features.Suppliers;

public static class SupplierMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Supplier, SupplierDetailItem>();
        config.NewConfig<Supplier, SupplierListItem>();

        config.NewConfig<CreateSupplierCommand, Supplier>()
            .Ignore(d => d.ProductCategories,
                    d => d.OwnerId, d => d.OrganizationId)
            .IgnoreAuditFields();

        config.NewConfig<UpdateSupplierCommand, Supplier>()
            .IgnoreNullValues(true)
            .Ignore(d => d.ProductCategories,
                    d => d.OwnerId, d => d.OrganizationId)
            .IgnoreAuditFields();
    }
}
