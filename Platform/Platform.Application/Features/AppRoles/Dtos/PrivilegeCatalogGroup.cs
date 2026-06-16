namespace Platform.Application.Features.AppRoles.Dtos;

/// <summary>
/// Bir entity'e ait tüm privilege code'larını gruplar. Rol detay ekranında
/// satır = entity, kolon = eylem matrisini besler.
/// Kaynak: auth_privilege tablosu (dinamik; statik PrivilegeRegistry değil).
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

    /// <summary>
    /// DB'deki privilege_name. Lokalizasyon anahtarı bulunmayan kodlarda
    /// istemci tarafı yedek etiket olarak kullanılabilir.
    /// </summary>
    public string Name { get; set; } = default!;
}
