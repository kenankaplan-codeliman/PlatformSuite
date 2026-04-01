using CRM.Domain.Entities.Accounts;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;

namespace CRM.Application.Modals.AccountModal;

public class AccountDetailItem
{
    public Guid Id { get; set; } = default!;

    public string AccountName { get; set; } = default!;

    public AccountType AccountType { get; set; }

    public AccountStatus AccountStatus { get; set; }

    public string? Industry { get; set; }

    public decimal? AnnualRevenue { get; set; }

    public int? NumberOfEmployees { get; set; }

    public string? Website { get; set; }

    public string? Description { get; set; }

    public Guid? ParentAccountId { get; set; }

    public string? ParentAccountName { get; set; }

    public List<AccountEmailModal> Emails { get; set; } = new();

    public List<AccountPhoneModal> Phones { get; set; } = new();

    public List<AccountAddressModal> Addresses { get; set; } = new();

    public List<AccountContactModal> Contacts { get; set; } = new();

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsActive { get; set; }
}
