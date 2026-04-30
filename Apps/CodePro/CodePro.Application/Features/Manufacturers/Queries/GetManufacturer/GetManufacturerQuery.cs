using CodePro.Application.Features.Manufacturers.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Manufacturers.Queries.GetManufacturer;

public sealed record GetManufacturerQuery(Guid Id) : IQuery<ManufacturerDetailItem>;
