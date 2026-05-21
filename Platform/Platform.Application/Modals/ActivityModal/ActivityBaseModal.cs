using Platform.Application.Common.Attachments;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Modals.ActivityModal
{
    public class ActivityBaseModal : IAttachmentCarrier
    {
        public ActivityBaseModal(ActivityType activityType) {
            this.ActivityType = activityType;
        }

        public Guid Id { get; set; } = default!;
        public string Subject { get; set; } = default!;

        public ActivityType ActivityType { get; private set; }
        public ActivityStatus Status { get; set; }
        public ActivityPriority Priority { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? DueDate { get; set; }
        public EntityReference? RegardingEntity { get; set; }

        public EntityReference? Owner { get; set; }

        public bool IsActive { get; set; }

        /// <summary>
        /// Create/update sırasında ilişkilendirilecek pending draft attachment'lar.
        /// Yalnızca write yönünde anlamlıdır; read modallarında boş döner.
        /// </summary>
        public List<AttachmentAssociation> Attachments { get; set; } = new();

    }

}
