using Crm.Application.Features.Leads.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Leads.Commands.ConvertLead;

/// <summary>
/// Lead'i Account/Contact (ve opsiyonel Opportunity) kayıtlarına dönüştürür.
/// Kullanıcı dialog'da neyin oluşturulacağını seçer:
///  - <see cref="AccountId"/> doluysa mevcut firmaya bağlanır (yeni firma açılmaz).
///  - <see cref="CreateAccount"/> true + AccountId boşsa Lead'ten yeni firma oluşturulur.
///  - <see cref="CreateContact"/> true ise Lead'ten kişi oluşturulur (firma varsa ilişkilendirilir).
///  - <see cref="CreateOpportunity"/> true ise (firma şartıyla) fırsat oluşturulur.
/// Lead iletişimleri (email/telefon/adres) hedef Account/Contact'a kopyalanır.
/// </summary>
public sealed class ConvertLeadCommand : ICommand<ConvertLeadResult>
{
    public Guid Id { get; init; }
    public bool CreateAccount { get; init; }
    /// <summary>Mevcut firmaya bağlama — doluysa yeni firma oluşturulmaz.</summary>
    public Guid? AccountId { get; init; }
    public bool CreateContact { get; init; }
    public bool CreateOpportunity { get; init; }
}
