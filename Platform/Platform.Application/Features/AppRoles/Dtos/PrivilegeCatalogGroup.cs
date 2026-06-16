namespace Platform.Application.Features.AppRoles.Dtos;

/// <summary>
/// Bir entity'e ait tüm privilege code'larını gruplar. Rol detay ekranında
/// "satır başı entity adı + yanında privilege listesi" görünümünü besler.
/// Kaynak: <see cref="Platform.Domain.Authorization.PrivilegeRegistry.All"/>.
/// </summary>
public class PrivilegeCatalogGroup
{
    public string Entity { get; set; } = default!;
    public List<PrivilegeCatalogEntry> Privileges { get; set; } = new();
}

public class PrivilegeCatalogEntry
{
    /// <summary>Tam privilege kodu, ör. "Account.Create".</summary>
    public string Code { get; set; } = default!;

    /// <summary>Entity sonrası eylem kısmı, ör. "Create".</summary>
    public string Action { get; set; } = default!;
}
