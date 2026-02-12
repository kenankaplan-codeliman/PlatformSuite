using CRM.Domain.Entities.Common;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Enums;
using System;
using static System.Net.Mime.MediaTypeNames;

namespace CRM.Domain.Entities.Leads
{

    public class Lead : IBaseEntity, ISoftDeleteEntity, IAuditableEntity, IOwnedEntity
    {
        public Guid Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? JobTitle { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? MobilePhone { get; set; }
        public string? Website { get; set; }
        public LeadSource LeadSource { get; set; }
        public LeadStatus LeadStatus { get; set; }
        public LeadRating LeadRating { get; set; }
        public string? Industry { get; set; }
        public int? NumberOfEmployees { get; set; }
        public decimal? AnnualRevenue { get; set; }
        public decimal? EstimatedValue { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public DateTime? ConvertedDate { get; set; }
        public Guid? ConvertedAccountId { get; set; }
        public Guid? ConvertedContactId { get; set; }
        public Guid? ConvertedOpportunityId { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public Guid? DeletedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public Guid OwnerId { get; set; }
        public Guid OrganizationId { get; set; }
        
    }
}