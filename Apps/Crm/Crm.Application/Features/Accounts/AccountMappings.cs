using Crm.Application.Features.Accounts.Commands.CreateAccount;
using Crm.Application.Features.Accounts.Commands.UpdateAccount;
using Crm.Application.Features.Accounts.Dtos;
using Platform.Application.Mapping;
using Platform.Application.Modals.Common;
using Crm.Domain.Entities.Accounts;
using Crm.Domain.Entities.Contacts;
using Mapster;

namespace Crm.Application.Features.Accounts;

public static class AccountMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        // AccountContact kendine özel DTO'su var (join table + Contact → EntityReference)
        config.NewConfig<AccountContact, AccountContactModal>()
            .Map(d => d.Contact, s => new EntityReference(nameof(Contact))
            {
                Id = s.ContactId,
                Name = s.Contact != null ? s.Contact.DisplayName : string.Empty,
            });

        // ========= Account → Detail =========
        // Emails/Phones/Addresses aggregate navigation değil; handler ICrmDbContext üzerinden doldurur.

        config.NewConfig<Account, AccountDetailItem>()
            .Map(d => d.ParentAccount, s => s.ParentAccount != null
                ? new EntityReference(nameof(Account))
                {
                    Id = s.ParentAccount.Id,
                    Name = s.ParentAccount.AccountName,
                }
                : null)
            .Map(d => d.Contacts, s => s.AccountContacts);

        // Account → AccountListItem: temel alanlar otomatik map'lenir. PrimaryEmail/Phone/City
        // navigation üzerinden gelmiyor; ListAccountsHandler sayfa sonrası batch sorguyla doldurur.

        // ========= CreateAccountCommand → Account =========

        config.NewConfig<CreateAccountCommand, Account>()
            .Map(d => d.ParentAccountId, s => s.ParentAccount != null ? (Guid?)s.ParentAccount.Id : null)
            .Ignore(d => d.ParentAccount!, d => d.ChildAccounts, d => d.AccountContacts)
            .IgnoreAuditFields()
            .AfterMapping((src, dst) => SyncAccountContacts(src.Contacts, dst));

        // ========= UpdateAccountCommand → Account (in-place) =========
        // ParentAccountId her zaman set edilir (clear durumunu da yakalamak için
        // IgnoreNullValues'ın dışında, AfterMapping içinde uygulanır).

        config.NewConfig<UpdateAccountCommand, Account>()
            .IgnoreNullValues(true)
            .Ignore(d => d.ParentAccountId!, d => d.ParentAccount!, d => d.ChildAccounts, d => d.AccountContacts)
            .IgnoreAuditFields()
            .AfterMapping((src, dst) =>
            {
                dst.ParentAccountId = src.ParentAccount?.Id;
                SyncAccountContacts(src.Contacts, dst);
            });
    }

    private static void SyncAccountContacts(IReadOnlyList<AccountContactModal> contacts, Account account)
    {
        CollectionSync.Merge(
            contacts, account.AccountContacts,
            srcId: s => s.Id,
            dstId: d => d.Id,
            factory: s => new AccountContact
            {
                AccountId = account.Id,
                ContactId = s.Contact!.Id,
                Role = s.Role,
                IsPrimary = s.IsPrimary,
            },
            update: (s, d) =>
            {
                d.ContactId = s.Contact!.Id;
                d.Role = s.Role;
                d.IsPrimary = s.IsPrimary;
            });
    }
}
