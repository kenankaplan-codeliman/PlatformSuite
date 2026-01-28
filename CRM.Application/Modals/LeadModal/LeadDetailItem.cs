using System;
using System.Collections.Generic;
using System.Text;
using CRM.Domain.Enums;
using CRM.Domain.Entities.Lead;
using System.ComponentModel;

namespace CRM.Application.Modals.LeadModal
{
    public class LeadDetailItem
    {
        public Guid? Id { get; set; }
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

        public static LeadDetailItem fromEntity(Lead entity)
        {
            return new LeadDetailItem()
            {
                Id = entity.Id,
                CompanyName = entity.CompanyName,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                JobTitle = entity.JobTitle,
                Email = entity.Email,
                Phone = entity.Phone,
                MobilePhone = entity.MobilePhone,
                Website = entity.Website,
                Address = entity.Address,
                Description = entity.Description,
                Industry = entity.Industry,
                NumberOfEmployees = entity.NumberOfEmployees,
                LeadSource = entity.LeadSource,
                LeadStatus = entity.LeadStatus,
                LeadRating = entity.LeadRating,
                AnnualRevenue = entity.AnnualRevenue,
                EstimatedValue = entity.EstimatedValue,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                ConvertedDate = entity.ConvertedDate,
                IsActive = entity.IsActive,

            };
        }

        public static Lead toEntity(LeadDetailItem modal)
        {
            if (modal == null)
                throw new InvalidEnumArgumentException("modal is null");

            Lead lead = new Lead()
            {
                CompanyName = modal.CompanyName ?? "",
                FirstName = modal.FirstName ?? "",
                LastName = modal.LastName ?? "",
                JobTitle = modal.JobTitle,
                Email = modal.Email,
                Phone = modal.Phone,
                MobilePhone = modal.MobilePhone,
                Website = modal.Website,
                Address = modal.Address,
                Description = modal.Description,
                Industry = modal.Industry,
                NumberOfEmployees = modal.NumberOfEmployees,
                LeadSource = modal.LeadSource,
                LeadStatus = modal.LeadStatus,
                LeadRating = modal.LeadRating,
                AnnualRevenue = modal.AnnualRevenue,
                EstimatedValue = modal.EstimatedValue,
                IsActive = modal.IsActive,
            };

            if (modal.Id.HasValue && !Guid.Empty.Equals(modal.Id))
                lead.Id = modal.Id.Value;

            return lead;
        }
    }
}
