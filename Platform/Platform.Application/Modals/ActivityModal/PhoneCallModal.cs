using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Modals.ActivityModal
{
    public class PhoneCallModal : ActivityBaseModal
    {
        public PhoneCallModal() : base(ActivityType.PhoneCall)
        {
        }

        public EntityReference? Caller { get; set; }
        public EntityReference? Recipient { get; set; }
        
        public Direction Direction { get; set; }

        public string? CallNotes { get; set; }

        public string? RecordingUrl { get; set; }
    }
}
