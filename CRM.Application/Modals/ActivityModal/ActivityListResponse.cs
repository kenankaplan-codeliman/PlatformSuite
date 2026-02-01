using CRM.Application.Modals.ActivityModal;
using CRM.Domain.Entities.Lead;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.ActivityModal
{
    public class ActivityListResponse
    {
        public List<ActivityBaseModal> Data { get; set; } = default!;
        public bool HasMore { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }

    }
}
