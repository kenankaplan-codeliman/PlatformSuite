using Crm.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.AccountModal;

public class AccountAddressModal
{
    public Guid? Id { get; set; }

    public string AddressLine1 { get; set; } = default!;

    public string? AddressLine2 { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? PostalCode { get; set; }

    public string? Country { get; set; }

    public AddressType Type { get; set; }

    public bool IsPrimary { get; set; }
}