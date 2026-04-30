using CodePro.Application.Features.PriceLists.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PriceLists.Commands.UpdatePriceList;

public sealed class UpdatePriceListCommand : ICommand<PriceListDetailItem>
{
    public Guid Id { get; init; }
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public Guid SupplierAccountId { get; init; }
}
