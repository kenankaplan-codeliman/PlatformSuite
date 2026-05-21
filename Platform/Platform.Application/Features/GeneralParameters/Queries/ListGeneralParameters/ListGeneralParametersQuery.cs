using Platform.Application.Common.Abstractions;
using Platform.Application.Features.GeneralParameters.Dtos;

namespace Platform.Application.Features.GeneralParameters.Queries.ListGeneralParameters;

/// <summary>
/// Parametre listesini code + parentCode ile döner. <see cref="ParentCode"/>
/// verilirse yalnız o tipin değer satırları, verilmezse tüm parametreler döner.
/// <see cref="Lang"/> etiket dilini belirler; o dilde kayıt yoksa varsayılan dile (tr) fallback yapılır.
/// </summary>
public sealed class ListGeneralParametersQuery : IQuery<IReadOnlyList<GeneralParameterListItem>>
{
    public string? ParentCode { get; init; }
    public string? Lang { get; init; }
}
