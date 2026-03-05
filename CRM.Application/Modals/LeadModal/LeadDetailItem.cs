using CRM.Domain.Entities.Leads;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using static CRM.Domain.Authorization.PrivilegeCodes;

namespace CRM.Application.Modals.LeadModal
{
    public class LeadDetailItem
    {
        public Guid Id { get; set; }
        public string? CompanyName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? JobTitle { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? MobilePhone { get; set; }
        public string? Website { get; set; }
        public string? Address { get; set; }
        public string? Description { get; set; }
        public string? Industry { get; set; }
        public int? NumberOfEmployees { get; set; }
        public LeadSource LeadSource { get; set; }
        public LeadStatus LeadStatus { get; set; }
        public LeadRating LeadRating { get; set; }
        public decimal? AnnualRevenue { get; set; }
        public decimal? EstimatedValue { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ConvertedDate { get; set; }
        public bool IsActive { get; set; }
        
    }
}
