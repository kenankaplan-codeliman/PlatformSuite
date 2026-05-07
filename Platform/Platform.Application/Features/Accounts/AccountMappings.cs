using Platform.Application.Common.Dtos.Communications;
using Platform.Application.Features.Accounts.Commands.CreateAccount;
using Platform.Application.Features.Accounts.Commands.UpdateAccount;
using Platform.Application.Features.Accounts.Dtos;
using Platform.Application.Mapping;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Accounts;
using Platform.Domain.Entities.Communications;
using Platform.Domain.Enums;
using Mapster;

namespace Platform.Application.Features.Accounts;

public static class AccountMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        // ========= Sub-entity (derived) → shared DTO: base map'ten türer =========

        config.NewConfig<AccountEmail, EmailModal>()
            .Inherits<EmailBase, EmailModal>();

        config.NewConfig<AccountPhone, PhoneModal>()
            .Inherits<PhoneBase, PhoneModal>();

        config.NewConfig<AccountAddress, AddressModal>()
            .Inherits<AddressBase, AddressModal>();

        // AccountContact kendine özel DTO'su var (join table + Contact.DisplayName flatten)
        config.NewConfig<AccountContact, AccountContactModal>()
            .Map(d => d.ContactName, s => s.Contact != null ? s.Contact.DisplayName : null);

        // ========= Account → Detail / List =========

        config.NewConfig<Account, AccountDetailItem>()
            .Map(d => d.ParentAccount, s => s.ParentAccount != null
                ? new EntityReference(EntityType.Account)
                {
                    Id = s.ParentAccount.Id,
                    Name = s.ParentAccount.AccountName,
                }
                : null)
            .Map(d => d.Contacts, s => s.AccountContacts);

        config.NewConfig<Account, AccountListItem>()
            .Map(d => d.PrimaryEmail, s => s.Emails.Where(e => e.IsPrimary).Select(e => e.Email).FirstOrDefault())
            .Map(d => d.PrimaryPhone, s => s.Phones.Where(p => p.IsPrimary).Select(p => p.PhoneNumber).FirstOrDefault())
            .Map(d => d.PrimaryCity, s => s.Addresses.Where(a => a.IsPrimary).Select(a => a.City).FirstOrDefault());

        // ========= Shared DTO → derived sub-entity (factory) =========

        config.NewConfig<EmailModal, AccountEmail>()
            .Inherits<EmailModal, EmailBase>()
            .Ignore(d => d.AccountId, d => d.Account);

        config.NewConfig<PhoneModal, AccountPhone>()
            .Inherits<PhoneModal, PhoneBase>()
            .Ignore(d => d.AccountId, d => d.Account);

        config.NewConfig<AddressModal, AccountAddress>()
            .Inherits<AddressModal, AddressBase>()
            .Ignore(d => d.AccountId, d => d.Account);

        // ========= CreateAccountCommand → Account =========

        config.NewConfig<CreateAccountCommand, Account>()
            .Map(d => d.ParentAccountId, s => s.ParentAccount != null ? (Guid?)s.ParentAccount.Id : null)
            .Ignore(d => d.ParentAccount!, d => d.ChildAccounts,
                    d => d.Emails, d => d.Phones, d => d.Addresses, d => d.AccountContacts)
            .IgnoreAuditFields()
            .AfterMapping((src, dst) => SyncCollections(src.Emails, src.Phones, src.Addresses, src.Contacts, dst));

        // ========= UpdateAccountCommand → Account (in-place) =========
        // ParentAccountId her zaman set edilir (clear durumunu da yakalamak için
        // IgnoreNullValues'ın dışında, AfterMapping içinde uygulanır).

        config.NewConfig<UpdateAccountCommand, Account>()
            .IgnoreNullValues(true)
            .Ignore(d => d.ParentAccountId, d => d.ParentAccount!, d => d.ChildAccounts,
                    d => d.Emails, d => d.Phones, d => d.Addresses, d => d.AccountContacts)
            .IgnoreAuditFields()
            .AfterMapping((src, dst) =>
            {
                dst.ParentAccountId = src.ParentAccount?.Id;
                SyncCollections(src.Emails, src.Phones, src.Addresses, src.Contacts, dst);
            });
    }

    private static void SyncCollections(
        IReadOnlyList<EmailModal> emails,
        IReadOnlyList<PhoneModal> phones,
        IReadOnlyList<AddressModal> addresses,
        IReadOnlyList<AccountContactModal> contacts,
        Account account)
    {
        CollectionSync.Merge(
            emails, account.Emails,
            srcId: s => s.Id,
            dstId: d => d.Id,
            factory: s =>
            {
                var e = s.Adapt<AccountEmail>();
                e.AccountId = account.Id;
                return e;
            },
            update: (s, d) =>
            {
                d.Email = s.Email;
                d.Type = s.Type;
                d.IsPrimary = s.IsPrimary;
            });

        CollectionSync.Merge(
            phones, account.Phones,
            srcId: s => s.Id,
            dstId: d => d.Id,
            factory: s =>
            {
                var p = s.Adapt<AccountPhone>();
                p.AccountId = account.Id;
                return p;
            },
            update: (s, d) =>
            {
                d.PhoneNumber = s.PhoneNumber;
                d.Type = s.Type;
                d.IsPrimary = s.IsPrimary;
            });

        CollectionSync.Merge(
            addresses, account.Addresses,
            srcId: s => s.Id ?? Guid.Empty,
            dstId: d => d.Id,
            factory: s =>
            {
                var a = s.Adapt<AccountAddress>();
                a.AccountId = account.Id;
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
            contacts, account.AccountContacts,
            srcId: s => s.Id,
            dstId: d => d.Id,
            factory: s => new AccountContact
            {
                AccountId = account.Id,
                ContactId = s.ContactId,
                Role = s.Role,
                IsPrimary = s.IsPrimary,
            },
            update: (s, d) =>
            {
                d.ContactId = s.ContactId;
                d.Role = s.Role;
                d.IsPrimary = s.IsPrimary;
            });
    }
}
