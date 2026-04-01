using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.AccountModal;

public class AccountListFilter
{
    public string? accountName { get; set; }
    public AccountType? accountType { get; set; }
    public AccountStatus? accountStatus { get; set; }
    public string? Industry { get; set; }
    public bool? isActive { get; set; }
}
