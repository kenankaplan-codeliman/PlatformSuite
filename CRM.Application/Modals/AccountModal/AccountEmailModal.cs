using Crm.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.AccountModal;

public class AccountEmailModal
{
    public Guid Id { get; set; }

    public string Email { get; set; } = default!;

    public EmailType Type { get; set; }

    public bool IsPrimary { get; set; }
}