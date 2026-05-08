using CodePro.Application.Features.Suppliers.Commands.CreateSupplier;
using CodePro.Application.Features.Suppliers.Commands.UpdateSupplier;
using CodePro.Application.Features.Suppliers.Dtos;
using CodePro.Domain.Entities.Suppliers;
using Mapster;

namespace CodePro.Application.Features.Suppliers;

public static class SupplierMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Supplier, SupplierDetailItem>();
        config.NewConfig<Supplier, SupplierListItem>();

        config.NewConfig<CreateSupplierCommand, Supplier>()
            .Ignore(d => d.Id,
                    d => d.ProductCategories,
                    d => d.OwnerId, d => d.OrganizationId,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateSupplierCommand, Supplier>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.ProductCategories,
                    d => d.OwnerId, d => d.OrganizationId,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
