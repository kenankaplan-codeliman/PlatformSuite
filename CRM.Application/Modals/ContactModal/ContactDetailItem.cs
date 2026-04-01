using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.ContactModal;

public class ContactDetailItem
{
    public Guid Id { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public ContactStatus ContactStatus { get; set; }
    public string? Title { get; set; }
    public string? Department { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Description { get; set; }

    // Many-to-many
    public List<ContactAccountModal> AccountContacts { get; set; } = new();

    public List<ContactEmailModal> Emails { get; set; } = new();
    public List<ContactPhoneModal> Phones { get; set; } = new();
    public List<ContactAddressModal> Addresses { get; set; } = new();

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsActive { get; set; }

}
