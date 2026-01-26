using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Models
{
    public class LeadListFilter
    {
        public String? CompanyName { get; set; }
        public String? firstName { get; set; }
        public String? lastName { get; set; }
        public LeadStatus? leadStatus { get; set; }
        public LeadSource? leadSource { get; set; }
        public LeadRating? leadRating { get; set; }
        public String? industry { get; set; }
        public String? isActive { get; set; }
    }
}
