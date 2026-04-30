using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.PriceLists.Commands.DeletePriceList;

public sealed record DeletePriceListCommand(Guid Id) : ICommand;
