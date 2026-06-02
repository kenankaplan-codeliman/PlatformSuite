using Platform.Application.Common.Abstractions;
using Crm.Application.Features.Products.Dtos;

namespace Crm.Application.Features.Products.Commands.UpdateProduct;

public sealed class UpdateProductCommand : ICommand<ProductDetailItem>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string ProductCode { get; init; } = string.Empty;
    public string? Category { get; init; }
    public decimal? UnitPrice { get; init; }
    public string? UnitPriceCurrency { get; init; }
    public string? UnitOfMeasure { get; init; }
    public string? Description { get; init; }
}
