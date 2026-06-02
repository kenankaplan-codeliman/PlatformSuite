using Platform.Application.Common.Abstractions;
using Crm.Application.Features.Products.Dtos;

namespace Crm.Application.Features.Products.Commands.CreateProduct;

public sealed class CreateProductCommand : ICommand<ProductDetailItem>
{
    public string Name { get; init; } = string.Empty;
    public string ProductCode { get; init; } = string.Empty;
    public string? Category { get; init; }
    public decimal? UnitPrice { get; init; }
    public string? UnitPriceCurrency { get; init; }
    public string? UnitOfMeasure { get; init; }
    public string? Description { get; init; }
}
