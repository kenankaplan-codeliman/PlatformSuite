using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.ContactModal;

public class ContactListFilters
{
    public string? ContactName { get; set; }
    public Guid? AccountId { get; set; }
    public string? Title { get; set; }
    public string? Department { get; set; }
    public bool? IsActive { get; set; }
}
