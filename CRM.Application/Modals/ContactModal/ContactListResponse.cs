using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.ContactModal;

public class ContactListResponse
{
    public List<ContactListItem> Data { get; set; } = default!;
    public bool HasMore { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
