using CRM.Domain.Entities.Leads;

namespace CRM.Application.Modals.LeadModal;

public static class LeadMappingExtensions
{
    // ========================
    // Entity → Modal
    // ========================

    public static LeadDetailItem ToModal(this Lead entity)
    {
        return new LeadDetailItem
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

    // ========================
    // Modal → Entity
    // ========================

    public static void UpdateFrom(this Lead entity, LeadDetailItem modal)
    {
        entity.CompanyName = modal.CompanyName ?? string.Empty;
        entity.FirstName = modal.FirstName ?? string.Empty;
        entity.LastName = modal.LastName ?? string.Empty;
        entity.JobTitle = modal.JobTitle;
        entity.Email = modal.Email;
        entity.Phone = modal.Phone;
        entity.MobilePhone = modal.MobilePhone;
        entity.Website = modal.Website;
        entity.Address = modal.Address;
        entity.Description = modal.Description;
        entity.Industry = modal.Industry;
        entity.NumberOfEmployees = modal.NumberOfEmployees;
        entity.LeadSource = modal.LeadSource;
        entity.LeadStatus = modal.LeadStatus;
        entity.LeadRating = modal.LeadRating;
        entity.AnnualRevenue = modal.AnnualRevenue;
        entity.EstimatedValue = modal.EstimatedValue;
    }
}