using CodePro.Application.Features.Brands.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Brands.Commands.CreateBrand;

public sealed class CreateBrandCommand : ICommand<BrandDetailItem>
{
    public string Name { get; init; } = string.Empty;
}
