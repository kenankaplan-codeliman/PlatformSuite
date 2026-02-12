using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.AccountModal;

public class AccountContactModal
{
    public Guid Id { get; set; }

    public Guid ContactId { get; set; } = default!;

    public string? ContactName { get; set; }

    public string? Role { get; set; }

    public bool IsPrimary { get; set; }
}

