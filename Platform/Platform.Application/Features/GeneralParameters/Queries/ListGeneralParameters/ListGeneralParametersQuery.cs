using Platform.Application.Common.Abstractions;
using Platform.Application.Features.GeneralParameters.Dtos;

namespace Platform.Application.Features.GeneralParameters.Queries.ListGeneralParameters;

/// <summary>
/// Parametre listesini code + parentCode ile döner. <see cref="ParentCode"/>
/// verilirse yalnız o tipin değer satırları, verilmezse tüm parametreler döner.
/// </summary>
public sealed class ListGeneralParametersQuery : IQuery<IReadOnlyList<GeneralParameterListItem>>
{
    public string? ParentCode { get; init; }
}
