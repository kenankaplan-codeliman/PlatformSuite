using CRM.Application.Authentication.Interfaces;
using CRM.Domain.Enums;
using System;

namespace CRM.Infrastructure.Model
{
    public class CurrentUserContext : ICurrentUserContext
    {
        public Guid UserId { get; set; }
        public required string Email { get; set; }
        public required string DisplayName { get; set; }
        public Guid OrganizationId { get; set; }
        public string AccessTokenId { get; set; } = String.Empty;
        public AccessLevel AccessLevel { get; set; } = AccessLevel.None;    
        public List<Guid> AccessibleOrganizationList { get; set; } = new List<Guid>();
    }
}