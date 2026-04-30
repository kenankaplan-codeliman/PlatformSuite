using CodePro.Application.Features.Manufacturers.Commands.CreateManufacturer;
using CodePro.Application.Features.Manufacturers.Commands.UpdateManufacturer;
using CodePro.Application.Features.Manufacturers.Dtos;
using CodePro.Domain.Entities.Products;
using Mapster;

namespace CodePro.Application.Features.Manufacturers;

public static class ManufacturerMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Manufacturer, ManufacturerDetailItem>();
        config.NewConfig<Manufacturer, ManufacturerListItem>();

        config.NewConfig<CreateManufacturerCommand, Manufacturer>()
            .Ignore(d => d.Id,
                    d => d.ProductManufacturers,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateManufacturerCommand, Manufacturer>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.ProductManufacturers,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
