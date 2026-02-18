using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.ContactModal;

public class ContactAccountModal
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; } = default!;
    public string? AccountName { get; set; }
    public string? Role { get; set; }
    public bool IsPrimary { get; set; }
}
