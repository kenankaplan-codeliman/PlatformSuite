using Crm.Application.Features.Contacts.Commands.CreateContact;
using Crm.Application.Features.Contacts.Commands.UpdateContact;
using Crm.Application.Features.Contacts.Dtos;
using Platform.Application.Mapping;
using Platform.Application.Modals.Common;
using Crm.Domain.Entities.Accounts;
using Crm.Domain.Entities.Contacts;
using Mapster;

namespace Crm.Application.Features.Contacts;

public static class ContactMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        // AccountContact → Contact tarafından bakış (ContactAccountModal); Account → EntityReference
        config.NewConfig<AccountContact, ContactAccountModal>()
            .Map(d => d.Account, s => new EntityReference(nameof(Account))
            {
                Id = s.AccountId,
                Name = s.Account != null ? s.Account.AccountName : string.Empty,
            });

        // ========= Contact → Detail =========
        // Emails/Phones/Addresses aggregate navigation değil; handler ICrmDbContext üzerinden doldurur.

        config.NewConfig<Contact, ContactDetailItem>()
            .Map(d => d.AccountContacts, s => s.AccountContacts);

        // Contact → ContactListItem: PrimaryAccount navigation'dan gelir; PrimaryEmail/PrimaryPhone
        // ListContactsHandler sayfa sonrası batch sorguyla doldurulur.
        config.NewConfig<Contact, ContactListItem>()
            .Map(d => d.FullName, s => s.FirstName + " " + s.LastName)
            .Map(d => d.PrimaryAccount,
                 s => s.AccountContacts
                       .OrderByDescending(ac => ac.IsPrimary)
                       .Select(ac => new ContactAccountModal
                       {
                           Id = ac.Id,
                           Account = new EntityReference(nameof(Account))
                           {
                               Id = ac.AccountId,
                               Name = ac.Account != null ? ac.Account.AccountName : string.Empty,
                           },
                           Role = ac.Role,
                           IsPrimary = ac.IsPrimary,
                       })
                       .FirstOrDefault());

        // ========= CreateContactCommand → Contact =========

        config.NewConfig<CreateContactCommand, Contact>()
            .Ignore(d => d.AccountContacts)
            .IgnoreAuditFields()
            .AfterMapping((src, dst) => SyncAccountContacts(src.AccountContacts, dst));

        // ========= UpdateContactCommand → Contact (in-place) =========

        config.NewConfig<UpdateContactCommand, Contact>()
            .IgnoreNullValues(true)
            .Ignore(d => d.AccountContacts)
            .IgnoreAuditFields()
            .AfterMapping((src, dst) => SyncAccountContacts(src.AccountContacts, dst));
    }

    private static void SyncAccountContacts(IReadOnlyList<ContactAccountModal> accountContacts, Contact contact)
    {
        CollectionSync.Merge(
            accountContacts, contact.AccountContacts,
            srcId: s => s.Id,
            dstId: d => d.Id,
            factory: s => new AccountContact
            {
                ContactId = contact.Id,
                AccountId = s.Account!.Id,
                Role = s.Role,
                IsPrimary = s.IsPrimary,
            },
            update: (s, d) =>
            {
                d.AccountId = s.Account!.Id;
                d.Role = s.Role;
                d.IsPrimary = s.IsPrimary;
            });
    }
}
