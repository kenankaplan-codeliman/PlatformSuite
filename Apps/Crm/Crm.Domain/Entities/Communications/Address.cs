using Crm.Domain.Enums;
using Platform.Domain.Entities.Common;

namespace Crm.Domain.Entities.Communications;

public class Address : ICommunication, IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    // Polimorfik owner — "Account" | "Contact" | ...
    public string ParentEntityType { get; set; } = null!;
    public Guid ParentEntityId { get; set; }

    public string AddressLine1 { get; set; } = null!;
    public string? AddressLine2 { get; set; }

    // Ülke/şehir/ilçe GeneralParameter ile parametrik ve parent_code zinciriyle bağımlı.
    // Code + Name birlikte tutulur (snapshot): parametreden seçilirse hem code hem name dolar;
    // elle yazılırsa code boş kalır, yalnız name dolar. Read/list'te parametre tablosuna join YOK.
    //   CountryCode  → parent_code='Country' (ISO cca2)        | CountryName  serbest/etiket
    //   CityCode     → parent_code=<CountryCode>               | CityName     serbest/etiket
    //   DistrictCode → parent_code=<CityCode>                  | DistrictName serbest/etiket
    public string? CountryCode { get; set; }
    public string? CountryName { get; set; }
    public string? CityCode { get; set; }
    public string? CityName { get; set; }
    public string? DistrictCode { get; set; }
    public string? DistrictName { get; set; }

    // Eyalet/bölge — yalnız elle doldurulur (parametrik değil).
    public string? State { get; set; }

    public string? PostalCode { get; set; }

    public AddressType Type { get; set; }
    public bool IsPrimary { get; set; }

    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}
