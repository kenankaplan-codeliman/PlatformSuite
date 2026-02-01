using System;
using System.Collections.Generic;
using System.Text;
using CRM.Domain.Entities.Lead;
using CRM.Domain.Enums;

namespace CRM.Application.Modals.LeadModal
{
    public class LeadListItem
    {
        public Guid id { get; set; }
        public string? CompanyName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? MobilePhone { get; set; }
        public LeadStatus LeadStatus { get; set; }
        public LeadSource LeadSource { get; set; }
        public LeadRating LeadRating { get; set; }
        public string? Industry { get; set; }
        public decimal? EstimatedValue { get; set; }
        public bool IsActive { get; set; }

        public static LeadListItem fromEntity(Lead entity)
        {
            return new LeadListItem()
            {
                id = entity.Id,
                CompanyName = entity.CompanyName,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                MobilePhone = entity.MobilePhone,
                LeadStatus = entity.LeadStatus,
                LeadRating = entity.LeadRating,
                Industry = entity.Industry,
                EstimatedValue = entity.EstimatedValue,
                IsActive = entity.IsActive
            };
        }
    }
}
