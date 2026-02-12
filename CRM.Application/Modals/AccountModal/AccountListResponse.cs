using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.AccountModal;

public class AccountListResponse
{
    public List<AccountListItem> Data { get; set; } = default!;
    public bool HasMore { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
