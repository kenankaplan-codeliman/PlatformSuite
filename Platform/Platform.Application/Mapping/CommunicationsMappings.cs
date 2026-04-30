using Platform.Application.Common.Dtos.Communications;
using Platform.Domain.Entities.Communications;
using Mapster;

namespace Platform.Application.Mapping;

/// <summary>
/// Email/Phone/Address base entity'leri ile shared DTO'lar arasındaki
/// ortak mapping kurallarını tanımlar. AccountMappings ve ContactMappings
/// derived tipler için <c>Inherits&lt;Base, Target&gt;</c> çağırarak kullanır.
/// </summary>
public static class CommunicationsMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        // Entity (base) → DTO
        config.NewConfig<EmailBase, EmailModal>();
        config.NewConfig<PhoneBase, PhoneModal>();
        config.NewConfig<AddressBase, AddressModal>();

        // DTO → Entity (base) — id + audit/soft-delete ignore
        config.NewConfig<EmailModal, EmailBase>()
            .Ignore(d => d.Id,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<PhoneModal, PhoneBase>()
            .Ignore(d => d.Id,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<AddressModal, AddressBase>()
            .Ignore(d => d.Id,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
