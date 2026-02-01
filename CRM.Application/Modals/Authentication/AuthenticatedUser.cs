using CRM.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals
{
    public class AuthenticatedUser
    {
        public required Guid Id { get; set; }
        public required string Email { get; set; } = string.Empty;
        public required string DisplayName { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public Guid? OrganizationId { get; set; }
        public string? OrganizationName { get; set; }
    }
}
