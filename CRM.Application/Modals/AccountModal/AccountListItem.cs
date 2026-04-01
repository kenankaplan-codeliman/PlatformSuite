
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.AccountModal
{
    using CRM.Domain.Enums;
    using System;

    public class AccountListItem
    {
        public Guid Id { get; set; } = default!;

        public string AccountName { get; set; } = default!;

        public AccountType AccountType { get; set; }

        public AccountStatus AccountStatus { get; set; }

        public string? Industry { get; set; }

        public decimal? AnnualRevenue { get; set; }

        public int? NumberOfEmployees { get; set; }

        public string? Website { get; set; }

        public string? PrimaryEmail { get; set; }

        public string? PrimaryPhone { get; set; }

        public string? PrimaryCity { get; set; }

        public bool IsActive { get; set; }
    }

}
