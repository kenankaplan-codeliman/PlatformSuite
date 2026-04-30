using CodePro.Application.Features.PriceLists.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PriceLists.Commands.CreatePriceList;

public sealed class CreatePriceListCommand : ICommand<PriceListDetailItem>
{
    public string? Code { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public Guid SupplierAccountId { get; init; }
}
