using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface IAuthRoleRepository : IEntityRepository<AuthRole>
    {
        Task CreatePrivileges(CancellationToken cancellationToken = default);
        Task<AuthRole> GetOrCreateAsync(string roleName, AccessLevel accessLevel, bool isDefault = false, CancellationToken cancellationToken = default);
        Task<AuthRole?> GetDefaultRole(CancellationToken cancellationToken = default);

        Task<List<AuthRole>> GetUserRole(Guid userId, CancellationToken cancellationToken = default);

        Task AddUserRole(Guid userId, List<Guid> roleIds, CancellationToken cancellationToken = default);

        /// <summary>Kullanıcı rollerini verilen kümeyle senkronize eder (eksikleri ekler, fazlaları kaldırır).</summary>
        Task SyncUserRolesAsync(Guid userId, List<Guid> roleIds, CancellationToken cancellationToken = default);

        /// <summary>Rol için privileges koleksiyonunu verilen kümeyle senkronize eder.</summary>
        Task SyncRolePrivilegesAsync(Guid roleId, List<RolePrivilegeAssignment> privileges, CancellationToken cancellationToken = default);
    }

    public sealed class RolePrivilegeAssignment
    {
        public string PrivilegeCode { get; init; } = default!;
        public AccessLevel AccessLevel { get; init; } = AccessLevel.None;
    }
}
