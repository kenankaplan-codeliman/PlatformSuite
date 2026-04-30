using CodePro.Application.Features.Manufacturers.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Manufacturers.Commands.UpdateManufacturer;

public sealed class UpdateManufacturerCommand : ICommand<ManufacturerDetailItem>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
}
