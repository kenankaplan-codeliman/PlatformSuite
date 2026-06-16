using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppRoles.Dtos;

namespace Platform.Application.Features.AppRoles.Queries.GetPrivilegeCatalog;

/// <summary>
/// Sistemde tanımlı tüm privilege code'larının entity bazında gruplanmış kataloğu.
/// Rol detay ekranı, rolün kendi privilege seviyeleriyle birleştirmek için kullanır.
/// </summary>
public sealed record GetPrivilegeCatalogQuery : IQuery<List<PrivilegeCatalogGroup>>;
