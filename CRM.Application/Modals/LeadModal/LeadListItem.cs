using System;
using System.Collections.Generic;
using System.Text;
using CRM.Domain.Entities.Lead;

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

        public static LeadListItem fromEntity(Lead entity)
        {
            return new LeadListItem()
            {
                CompanyName = entity.CompanyName,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                MobilePhone = entity.MobilePhone,
            };
        }
    }
}
