using CRM.Application.Modals.LeadModal;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.Common
{
    public class PaginationResult<T>
    {
        public List<T> Data { get; set; } = new List<T>();
        public bool HasMore { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
