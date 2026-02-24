using CRM.Domain.Entities.Accounts;
using System.Security.Principal;

namespace CRM.Application.Modals.AccountModal;

public static class AccountMappingExtensions
{
    // ========================
    // Entity → Modal
    // ========================

    public static AccountDetailItem ToModal(this Account entity)
    {
        return new AccountDetailItem
        {
            Id = entity.Id,
            AccountName = entity.AccountName,
            AccountType = entity.AccountType,
            Industry = entity.Industry,
            AnnualRevenue = entity.AnnualRevenue,
            NumberOfEmployees = entity.NumberOfEmployees,
            Website = entity.Website,
            Description = entity.Description,
            ParentAccountId = entity.ParentAccountId,
            ParentAccountName = entity.ParentAccount?.AccountName,
            Emails = entity.Emails.Select(e => e.ToModal()).ToList(),
            Phones = entity.Phones.Select(p => p.ToModal()).ToList(),
            Addresses = entity.Addresses.Select(a => a.ToModal()).ToList(),
            Contacts = entity.AccountContacts.Select(c => c.ToModal()).ToList(),
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            IsActive = entity.IsActive
        };
    }

    public static AccountEmailModal ToModal(this AccountEmail entity)
    {
        return new AccountEmailModal
        {
            Id = entity.Id,
            Email = entity.Email,
            Type = entity.Type,
            IsPrimary = entity.IsPrimary
        };
    }

    public static AccountPhoneModal ToModal(this AccountPhone entity)
    {
        return new AccountPhoneModal
        {
            Id = entity.Id,
            PhoneNumber = entity.PhoneNumber,
            Type = entity.Type,
            IsPrimary = entity.IsPrimary
        };
    }

    public static AccountAddressModal ToModal(this AccountAddress entity)
    {
        return new AccountAddressModal
        {
            Id = entity.Id,
            AddressLine1 = entity.AddressLine1,
            AddressLine2 = entity.AddressLine2,
            City = entity.City,
            State = entity.State,
            PostalCode = entity.PostalCode,
            Country = entity.Country,
            Type = entity.Type,
            IsPrimary = entity.IsPrimary
        };
    }

    public static AccountContactModal ToModal(this AccountContact entity)
    {
        return new AccountContactModal
        {
            Id = entity.Id,
            ContactId = entity.ContactId,
            ContactName = $"{entity.Contact?.FirstName} {entity.Contact?.LastName}",
            Role = entity.Role,
            IsPrimary = entity.IsPrimary
        };
    }

    // ========================
    // Modal → Entity
    // ========================



    public static void UpdateFrom(this Account entity, AccountDetailItem modal)
    {
        entity.AccountName = modal.AccountName;
        entity.AccountType = modal.AccountType;
        entity.Industry = modal.Industry;
        entity.AnnualRevenue = modal.AnnualRevenue;
        entity.NumberOfEmployees = modal.NumberOfEmployees;
        entity.Website = modal.Website;
        entity.Description = modal.Description;
        entity.ParentAccountId = modal.ParentAccountId;
        //entity.IsActive = modal.IsActive;

        SyncEmails(entity, modal);
        SyncPhones(entity, modal);
        SyncAddress(entity, modal);
        SyncAccountContact(entity, modal);
    }

    private static void SyncEmails(Account entity, AccountDetailItem modal)
    {
        var entityDict = entity.Emails.ToDictionary(e => e.Id);

        // Sil
        foreach (var existing in entity.Emails.ToList())
        {
            if (!modal.Emails.Any(m => m.Id == existing.Id))
                entity.Emails.Remove(existing);
        }

        // Ekle & Güncelle
        foreach (var modalEmail in modal.Emails)
        {
            if (modalEmail.Id != Guid.Empty && entityDict.TryGetValue(modalEmail.Id, out var tracked))
            {
                //tracked.UpdateFrom(modalEmail);
            }
            else
            {
                var newEntity = modalEmail.ToEntity();
                entity.AddEmail(newEntity);
            }
        }
    }

    private static void SyncPhones(Account entity, AccountDetailItem modal)
    {
        var phonesToRemove = entity.Phones
            .Where(e => !modal.Phones.Any(m => m.Id == e.Id))
            .ToList();

        foreach (var phone in phonesToRemove)
        {
            entity.Phones.Remove(phone);
        }

        foreach (var phone in modal.Phones)
        {
            var existingPhone = entity.Phones.FirstOrDefault(e => e.Id == phone.Id);

            if (existingPhone == null)
            {
                entity.Phones.Add(phone.ToEntity(entity.Id));
            }
            else
            {
                existingPhone.UpdateFrom(phone);
            }
        }
    }

    private static void SyncAddress(Account entity, AccountDetailItem modal)
    {
        var addressesToRemove = entity.Addresses
            .Where(e => !modal.Addresses.Any(m => m.Id == e.Id))
            .ToList();

        foreach (var address in addressesToRemove)
        {
            entity.Addresses.Remove(address);
        }

        foreach (var address in modal.Addresses)
        {
            var existingAddress = entity.Addresses.FirstOrDefault(e => e.Id == address.Id);

            if (existingAddress == null)
            {
                entity.Addresses.Add(address.ToEntity(entity.Id));
            }
            else
            {
                existingAddress.UpdateFrom(address);
            }
        }
    }

    private static void SyncAccountContact(Account entity, AccountDetailItem modal)
    {
        var accCntToRemove = entity.AccountContacts
            .Where(e => !modal.Contacts.Any(m => m.Id == e.Id))
            .ToList();

        foreach (var accCnt in accCntToRemove)
        {
            entity.AccountContacts.Remove(accCnt);
        }

        foreach (var modalAccCnt in modal.Contacts)
        {
            var existingAccCnt = Guid.Empty.Equals(modalAccCnt.Id) ? null : entity.AccountContacts.FirstOrDefault(e => e.Id == modalAccCnt.Id);

            if (existingAccCnt == null)
            {
                entity.AccountContacts.Add(modalAccCnt.ToEntity(entity.Id));
            }
            else
            {
                existingAccCnt.UpdateFrom(modalAccCnt);
            }
        }
    }

    private static void UpdateFrom(this AccountEmail entity, AccountEmailModal modal)
    {
        entity.Email = modal.Email;
        entity.Type = modal.Type;
        entity.IsPrimary = modal.IsPrimary;
    }

    private static void UpdateFrom(this AccountPhone entity, AccountPhoneModal modal)
    {
        entity.PhoneNumber = modal.PhoneNumber;
        entity.Type = modal.Type;
        entity.IsPrimary = modal.IsPrimary;
    }

    private static void UpdateFrom(this AccountAddress entity, AccountAddressModal modal)
    {
        entity.AddressLine1 = modal.AddressLine1;
        entity.AddressLine2 = modal.AddressLine2;
        entity.City = modal.City;
        entity.State = modal.State;
        entity.PostalCode = modal.PostalCode;
        entity.Country = modal.Country;
        entity.Type = modal.Type;
        entity.IsPrimary = modal.IsPrimary;
    }

    private static void UpdateFrom(this AccountContact entity, AccountContactModal modal)
    {
        entity.ContactId = modal.ContactId;
        entity.Role = modal.Role;
        entity.IsPrimary = modal.IsPrimary;
    }




    private static AccountEmail ToEntity(this AccountEmailModal modal)
    {
        return new AccountEmail
        {
            Email = modal.Email,
            Type = modal.Type,
            IsPrimary = modal.IsPrimary
        };
    }

    private static AccountPhone ToEntity(this AccountPhoneModal modal, Guid accountId)
    {
        return new AccountPhone
        {

            AccountId = accountId,
            PhoneNumber = modal.PhoneNumber,
            Type = modal.Type,
            IsPrimary = modal.IsPrimary
        };
    }

    private static AccountAddress ToEntity(this AccountAddressModal modal, Guid accountId)
    {
        return new AccountAddress
        {
            AccountId = accountId,
            AddressLine1 = modal.AddressLine1,
            AddressLine2 = modal.AddressLine2,
            City = modal.City,
            State = modal.State,
            PostalCode = modal.PostalCode,
            Country = modal.Country,
            Type = modal.Type,
            IsPrimary = modal.IsPrimary
        };
    }

    private static AccountContact ToEntity(this AccountContactModal modal, Guid accountId)
    {
        return new AccountContact
        {

            AccountId = accountId,
            ContactId = modal.ContactId,
            Role = modal.Role,
            IsPrimary = modal.IsPrimary
        };
    }


}