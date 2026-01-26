using CRM.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Identity
{
    public class AppUser : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public Guid OrganizationId { get; set; }
        public string? Microsoft365Id { get; set; }
        public string? PasswordHash { get; set; }
        public bool IsActive { get; set; } = true;
        // IAuditableEntity
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        // ISoftDeleteEntity
        public bool IsDeleted { get; set; }
        public Guid? DeletedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
