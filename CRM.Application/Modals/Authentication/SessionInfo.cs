using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals
{
    public class SessionInfo
    {
        public Guid LoginHistoryId { get; set; }
        public required string AccessTokenId { get; set; }
        public DateTime LoginDate { get; set; }
        public DateTime AccessTokenExpiresAt { get; set; }
        public required string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiresAt { get; set; }
    }
}
