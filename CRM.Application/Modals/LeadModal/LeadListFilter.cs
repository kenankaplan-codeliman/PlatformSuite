using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CRM.Application.Modals.LeadModal
{
    public class LeadListFilter
    {
        public string? CompanyName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public LeadStatus? LeadStatus { get; set; }
        public LeadSource? LeadSource { get; set; }
        public LeadRating? LeadRating { get; set; }
        public string? Industry { get; set; }
        public bool? IsActive { get; set; }
    }
}
