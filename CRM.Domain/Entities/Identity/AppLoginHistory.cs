using CRM.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Identity
{
    public class AppLoginHistory : IBaseEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public DateTime LoginDate { get; set; }
        public DateTime? LogoutDate { get; set; }
        public required string AccessTokenId { get; set; }
        public DateTime AccessTokenExpiresAt { get; set; }
        public required string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiresAt { get; set; }
        public int RefreshCount { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public bool IsActive { get; set; } = true;  
    }
}
