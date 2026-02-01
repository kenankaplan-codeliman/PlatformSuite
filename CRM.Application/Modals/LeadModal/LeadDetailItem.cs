using CRM.Domain.Entities.Lead;
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

        public static Lead toEntity(LeadDetailItem modal, Lead? entity = null)
        {
            if (modal == null)
                throw new InvalidEnumArgumentException("modal is null");

            Lead lead = (entity == null) ? new Lead() : entity;

            lead.CompanyName = modal.CompanyName ?? "";
            lead.FirstName = modal.FirstName ?? "";
            lead.LastName = modal.LastName ?? "";
            lead.JobTitle = modal.JobTitle;
            lead.Email = modal.Email;
            lead.Phone = modal.Phone;
            lead.MobilePhone = modal.MobilePhone;
            lead.Website = modal.Website;
            lead.Address = modal.Address;
            lead.Description = modal.Description;
            lead.Industry = modal.Industry;
            lead.NumberOfEmployees = modal.NumberOfEmployees;
            lead.LeadSource = modal.LeadSource;
            lead.LeadStatus = modal.LeadStatus;
            lead.LeadRating = modal.LeadRating;
            lead.AnnualRevenue = modal.AnnualRevenue;
            lead.EstimatedValue = modal.EstimatedValue;
            lead.IsActive = modal.IsActive;

            return lead;
        }
    }
}
