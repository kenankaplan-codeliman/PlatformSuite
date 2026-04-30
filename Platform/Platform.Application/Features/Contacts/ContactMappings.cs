using Platform.Application.Common.Dtos.Communications;
using Platform.Application.Features.Contacts.Commands.CreateContact;
using Platform.Application.Features.Contacts.Commands.UpdateContact;
using Platform.Application.Features.Contacts.Dtos;
using Platform.Application.Mapping;
using Platform.Domain.Entities.Accounts;
using Platform.Domain.Entities.Communications;
using Platform.Domain.Entities.Contacts;
using Mapster;

namespace Platform.Application.Features.Contacts;

public static class ContactMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        // ========= Sub-entity (derived) → shared DTO =========

        config.NewConfig<ContactEmail, EmailModal>()
            .Inherits<EmailBase, EmailModal>();

        config.NewConfig<ContactPhone, PhoneModal>()
            .Inherits<PhoneBase, PhoneModal>();

        config.NewConfig<ContactAddress, AddressModal>()
            .Inherits<AddressBase, AddressModal>();

        // AccountContact → Contact tarafından bakış (ContactAccountModal)
        config.NewConfig<AccountContact, ContactAccountModal>()
            .Map(d => d.AccountName, s => s.Account != null ? s.Account.AccountName : null);

        // ========= Contact → Detail / List =========

        config.NewConfig<Contact, ContactDetailItem>()
            .Map(d => d.AccountContacts, s => s.AccountContacts);

        config.NewConfig<Contact, ContactListItem>()
            .Map(d => d.FullName, s => s.FirstName + " " + s.LastName)
            .Map(d => d.PrimaryAccount,
                 s => s.AccountContacts
                       .OrderByDescending(ac => ac.IsPrimary)
                       .Select(ac => new ContactAccountModal
                       {
                           Id = ac.Id,
                           AccountId = ac.AccountId,
                           AccountName = ac.Account != null ? ac.Account.AccountName : null,
                           Role = ac.Role,
                           IsPrimary = ac.IsPrimary,
                       })
                       .FirstOrDefault())
            .Map(d => d.PrimaryEmail, s => s.Emails.Where(e => e.IsPrimary).Select(e => e.Email).FirstOrDefault())
            .Map(d => d.PrimaryPhone, s => s.Phones.Where(p => p.IsPrimary).Select(p => p.PhoneNumber).FirstOrDefault());

        // ========= Shared DTO → derived sub-entity (factory) =========

        config.NewConfig<EmailModal, ContactEmail>()
            .Inherits<EmailModal, EmailBase>()
            .Ignore(d => d.ContactId, d => d.Contact);

        config.NewConfig<PhoneModal, ContactPhone>()
            .Inherits<PhoneModal, PhoneBase>()
            .Ignore(d => d.ContactId, d => d.Contact);

        config.NewConfig<AddressModal, ContactAddress>()
            .Inherits<AddressModal, AddressBase>()
            .Ignore(d => d.ContactId, d => d.Contact);

        // ========= CreateContactCommand → Contact =========

        config.NewConfig<CreateContactCommand, Contact>()
            .Ignore(d => d.Id,
                    d => d.AccountContacts, d => d.Emails, d => d.Phones, d => d.Addresses,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt)
            .AfterMapping((src, dst) => SyncCollections(src.Emails, src.Phones, src.Addresses, src.AccountContacts, dst));

        // ========= UpdateContactCommand → Contact (in-place) =========

        config.NewConfig<UpdateContactCommand, Contact>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.AccountContacts, d => d.Emails, d => d.Phones, d => d.Addresses,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt)
            .AfterMapping((src, dst) => SyncCollections(src.Emails, src.Phones, src.Addresses, src.AccountContacts, dst));
    }

    private static void SyncCollections(
        IReadOnlyList<EmailModal> emails,
        IReadOnlyList<PhoneModal> phones,
        IReadOnlyList<AddressModal> addresses,
        IReadOnlyList<ContactAccountModal> accountContacts,
        Contact contact)
    {
        CollectionSync.Merge(
            emails, contact.Emails,
            srcId: s => s.Id,
            dstId: d => d.Id,
            factory: s =>
            {
                var e = s.Adapt<ContactEmail>();
                e.ContactId = contact.Id;
                return e;
            },
            update: (s, d) =>
            {
                d.Email = s.Email;
                d.Type = s.Type;
                d.IsPrimary = s.IsPrimary;
            });

        CollectionSync.Merge(
            phones, contact.Phones,
            srcId: s => s.Id,
            dstId: d => d.Id,
            factory: s =>
            {
                var p = s.Adapt<ContactPhone>();
                p.ContactId = contact.Id;
                return p;
            },
            update: (s, d) =>
            {
                d.PhoneNumber = s.PhoneNumber;
                d.Type = s.Type;
                d.IsPrimary = s.IsPrimary;
            });

        CollectionSync.Merge(
            addresses, contact.Addresses,
            srcId: s => s.Id ?? Guid.Empty,
            dstId: d => d.Id,
            factory: s =>
            {
                var a = s.Adapt<ContactAddress>();
                a.ContactId = contact.Id;
                return a;
            },
            update: (s, d) =>
            {
                d.AddressLine1 = s.AddressLine1;
                d.AddressLine2 = s.AddressLine2;
                d.City = s.City;
                d.State = s.State;
                d.PostalCode = s.PostalCode;
                d.Country = s.Country;
                d.Type = s.Type;
                d.IsPrimary = s.IsPrimary;
            });

        CollectionSync.Merge(
            accountContacts, contact.AccountContacts,
            srcId: s => s.Id,
            dstId: d => d.Id,
            factory: s => new AccountContact
            {
                ContactId = contact.Id,
                AccountId = s.AccountId,
                Role = s.Role,
                IsPrimary = s.IsPrimary,
            },
            update: (s, d) =>
            {
                d.AccountId = s.AccountId;
                d.Role = s.Role;
                d.IsPrimary = s.IsPrimary;
            });
    }
}
