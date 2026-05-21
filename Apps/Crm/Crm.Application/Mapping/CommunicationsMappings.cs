using Crm.Application.Common.Dtos.Communications;
using Crm.Domain.Entities.Communications;
using Mapster;

namespace Crm.Application.Mapping;

/// <summary>
/// CRM iletişim entity'leri (Email/Phone/Address) → shared DTO mapping'leri.
/// Read path'te <c>ProjectToType&lt;EmailModal&gt;()</c> ile kullanılır. Yazma (DTO → entity)
/// alan kopyası CommunicationRepository içinde elle yapılır (parent/audit alanlarını korumak için).
/// </summary>
public static class CommunicationsMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<EmailAddress, EmailModal>();
        config.NewConfig<Phone, PhoneModal>();
        config.NewConfig<Address, AddressModal>();
    }
}
