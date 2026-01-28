using CRM.Domain.Entities.Lead;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.LeadModal
{
    public class LeadListResponse
    {
        public List<LeadListItem> Data { get; set; } = new List<LeadListItem>();
        public bool HasMore { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }

    }
}
