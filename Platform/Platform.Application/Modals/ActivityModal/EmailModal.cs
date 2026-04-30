using System;
using System.Collections.Generic;
using System.Text;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;

namespace Platform.Application.Modals.ActivityModal
{
    public class EmailModal : ActivityBaseModal
    {
        public EmailModal() : base(ActivityType.PhoneCall)
        {
        }

        public EntityReference From { get; set; } = default!;
        public List<EntityReference> To { get; set; } = default!;
        public List<EntityReference>? Cc { get; set; }
        public List<EntityReference>? Bcc { get; set; }

        // E-posta içeriği
        public string Body { get; set; } = default!;

        public bool IsHtml { get; set; }
        public bool IsSent { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadDate { get; set; }

    }
}
