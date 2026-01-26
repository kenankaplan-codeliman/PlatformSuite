using CRM.Domain.Entities.Lead;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Models
{
    public class LeadListResponse
    {
        public LeadListResponse() { 
            this.Data = new List<Lead>();   
        }

        public List<Lead> Data { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
