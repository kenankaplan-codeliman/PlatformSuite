using Crm.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.AccountModal;

public class AccountPhoneModal
{
    public Guid Id { get; set; }

    public string PhoneNumber { get; set; } = default!;

    public PhoneType Type { get; set; }

    public bool IsPrimary { get; set; }
}