using Crm.Application.Features.Products.Commands.CreateProduct;
using Crm.Application.Features.Products.Commands.UpdateProduct;
using Crm.Application.Features.Products.Dtos;
using Platform.Application.Mapping;
using Crm.Domain.Entities.Products;
using Mapster;

namespace Crm.Application.Features.Products;

public static class ProductMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        // Product → DetailItem / ListItem: alanlar birebir map'lenir (EntityReference child yok).

        config.NewConfig<CreateProductCommand, Product>()
            .IgnoreAuditFields();

        config.NewConfig<UpdateProductCommand, Product>()
            .IgnoreNullValues(true)
            .IgnoreAuditFields();
    }
}
