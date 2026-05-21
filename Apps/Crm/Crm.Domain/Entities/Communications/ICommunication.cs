namespace Crm.Domain.Entities.Communications;

/// <summary>
/// CRM iletişim kayıtlarının (email/telefon/adres) ortak polimorfik-owner sözleşmesi.
/// Her kayıt tür başına tek tabloda yaşar (email/phone/address) ve sahip entity'ye ayrı
/// FK ile değil, <see cref="ParentEntityType"/> + <see cref="ParentEntityId"/> ile bağlanır
/// (Account, Contact, ... fark etmeksizin). Junction tablo yoktur.
/// </summary>
public interface ICommunication
{
    Guid Id { get; }
    string ParentEntityType { get; set; }
    Guid ParentEntityId { get; set; }
}
