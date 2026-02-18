using CRM.Application.Modals.ContactModal;
using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Contacts;

namespace CRM.Application.Modals.ContactModal;

public static class ContactMappingExtensions
{
    // ========================
    // Entity → Modal
    // ========================

    public static ContactDetailItem ToModal(this Contact entity)
    {
        return new ContactDetailItem
        {
            Id = entity.Id,
            FirstName = entity.FirstName,
            LastName = entity.LastName,
            Title = entity.Title,
            Department = entity.Department,
            BirthDate = entity.BirthDate,
            Description = entity.Description,
            AccountContacts = entity.AccountContacts.Select(a => a.ToContactModal()).ToList(),
            Emails = entity.Emails.Select(e => e.ToModal()).ToList(),
            Phones = entity.Phones.Select(p => p.ToModal()).ToList(),
            Addresses = entity.Addresses.Select(a => a.ToModal()).ToList(),

            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            IsActive = entity.IsActive
        };
    }

    public static ContactEmailModal ToModal(this ContactEmail entity)
    {
        return new ContactEmailModal
        {
            Id = entity.Id.ToString(),
            Email = entity.Email,
            Type = entity.Type,
            IsPrimary = entity.IsPrimary
        };
    }

    public static ContactPhoneModal ToModal(this ContactPhone entity)
    {
        return new ContactPhoneModal
        {
            Id = entity.Id.ToString(),
            PhoneNumber = entity.PhoneNumber,
            Type = entity.Type,
            IsPrimary = entity.IsPrimary
        };
    }

    public static ContactAddressModal ToModal(this ContactAddress entity)
    {
        return new ContactAddressModal
        {
            Id = entity.Id.ToString(),
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

    public static ContactAccountModal ToContactModal(this AccountContact entity)
    {
        return new ContactAccountModal
        {
            Id = entity.Id,
            AccountId = entity.AccountId,
            AccountName = entity.Account?.AccountName,
            Role = entity.Role,
            IsPrimary = entity.IsPrimary
        };
    }

    // ========================
    // Modal → Entity
    // ========================

    public static void UpdateFrom(this Contact entity, ContactDetailItem modal)
    {
        entity.FirstName = modal.FirstName;
        entity.LastName = modal.LastName;
        entity.Title = modal.Title;
        entity.Department = modal.Department;
        entity.BirthDate = modal.BirthDate;
        entity.Description = modal.Description;

        SyncEmails(entity, modal);
        SyncPhones(entity, modal);
        SyncAddresses(entity, modal);
        SyncAccountContacts(entity, modal);
    }

    private static void SyncEmails(Contact entity, ContactDetailItem modal)
    {
        var emailsToRemove = entity.Emails
            .Where(e => !modal.Emails.Any(m => m.Id == e.Id.ToString()))
            .ToList();

        foreach (var email in emailsToRemove)
            entity.Emails.Remove(email);

        foreach (var modalEmail in modal.Emails)
        {
            var existingEmail = entity.Emails
                .FirstOrDefault(e => e.Id.ToString() == modalEmail.Id);

            if (existingEmail == null)
            {
                entity.Emails.Add(modalEmail.ToEntity(entity.Id));
            }
            else
            {
                existingEmail.UpdateFrom(modalEmail);
            }
        }
    }

    private static void SyncPhones(Contact entity, ContactDetailItem modal)
    {
        var phonesToRemove = entity.Phones
            .Where(e => !modal.Phones.Any(m => m.Id == e.Id.ToString()))
            .ToList();

        foreach (var phone in phonesToRemove)
            entity.Phones.Remove(phone);

        foreach (var modalPhone in modal.Phones)
        {
            var existingPhone = entity.Phones
                .FirstOrDefault(e => e.Id.ToString() == modalPhone.Id);

            if (existingPhone == null)
            {
                entity.Phones.Add(modalPhone.ToEntity(entity.Id));
            }
            else
            {
                existingPhone.UpdateFrom(modalPhone);
            }
        }
    }

    private static void SyncAddresses(Contact entity, ContactDetailItem modal)
    {
        var addressesToRemove = entity.Addresses
            .Where(e => !modal.Addresses.Any(m => m.Id == e.Id.ToString()))
            .ToList();

        foreach (var address in addressesToRemove)
            entity.Addresses.Remove(address);

        foreach (var modalAddress in modal.Addresses)
        {
            var existingAddress = entity.Addresses
                .FirstOrDefault(e => e.Id.ToString() == modalAddress.Id);

            if (existingAddress == null)
            {
                entity.Addresses.Add(modalAddress.ToEntity(entity.Id));
            }
            else
            {
                existingAddress.UpdateFrom(modalAddress);
            }
        }
    }

    private static void SyncAccountContacts(Contact entity, ContactDetailItem modal)
    {
        var accCntsToRemove = entity.AccountContacts
            .Where(e => !modal.AccountContacts.Any(m => m.Id == e.Id))
            .ToList();

        foreach (var accCnt in accCntsToRemove)
            entity.AccountContacts.Remove(accCnt);

        foreach (var modalAccCnt in modal.AccountContacts)
        {
            var existingAccCnt = Guid.Empty.Equals(modalAccCnt.Id) ? null :  entity.AccountContacts.FirstOrDefault(e => e.Id == modalAccCnt.Id);

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

    // ========================
    // UpdateFrom (Sub-Entities)
    // ========================

    private static void UpdateFrom(this ContactEmail entity, ContactEmailModal modal)
    {
        entity.Email = modal.Email;
        entity.Type = modal.Type;
        entity.IsPrimary = modal.IsPrimary;
    }

    private static void UpdateFrom(this ContactPhone entity, ContactPhoneModal modal)
    {
        entity.PhoneNumber = modal.PhoneNumber;
        entity.Type = modal.Type;
        entity.IsPrimary = modal.IsPrimary;
    }

    private static void UpdateFrom(this ContactAddress entity, ContactAddressModal modal)
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

    private static void UpdateFrom(this AccountContact entity, ContactAccountModal modal)
    {
        entity.AccountId = modal.AccountId;
        entity.Role = modal.Role;
        entity.IsPrimary = modal.IsPrimary;
    }

    // ========================
    // ToEntity (Sub-Entities)
    // ========================

    private static ContactEmail ToEntity(this ContactEmailModal modal, Guid contactId)
    {
        return new ContactEmail
        {
            ContactId = contactId,
            Email = modal.Email,
            Type = modal.Type,
            IsPrimary = modal.IsPrimary
        };
    }

    private static ContactPhone ToEntity(this ContactPhoneModal modal, Guid contactId)
    {
        return new ContactPhone
        {
            ContactId = contactId,
            PhoneNumber = modal.PhoneNumber,
            Type = modal.Type,
            IsPrimary = modal.IsPrimary
        };
    }

    private static ContactAddress ToEntity(this ContactAddressModal modal, Guid contactId)
    {
        return new ContactAddress
        {
            ContactId = contactId,
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

    private static AccountContact ToEntity(this ContactAccountModal modal, Guid contactId)
    {
        return new AccountContact
        {
            ContactId = contactId,
            AccountId = modal.AccountId,
            Role = modal.Role,
            IsPrimary = modal.IsPrimary
        };
    }
}