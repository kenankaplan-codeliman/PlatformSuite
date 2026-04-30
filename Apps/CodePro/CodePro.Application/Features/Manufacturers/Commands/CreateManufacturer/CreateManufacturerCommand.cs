using CodePro.Application.Features.Manufacturers.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Manufacturers.Commands.CreateManufacturer;

public sealed class CreateManufacturerCommand : ICommand<ManufacturerDetailItem>
{
    public string Name { get; init; } = string.Empty;
}
