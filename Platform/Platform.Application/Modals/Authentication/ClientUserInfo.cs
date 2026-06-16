using System;
using System.Collections.Generic;
using System.Text;
using Platform.Domain.Enums;

namespace Platform.Application.Modals.Authentication
{
    public class ClientUserInfo
    {
        public required string Email { get; set; } = default!;
        public required string DisplayName { get; set; } = default!;

        /// <summary>
        /// role_privilege'den türeyen privilege kodu → erişim seviyesi sözlüğü.
        /// UI menü görünürlüğü bu tek kaynaktan beslenir; güvenlik backend'de
        /// [PrivilegeAuthorize] ile zorlanır.
        /// </summary>
        public Dictionary<string, AccessLevel> Privileges { get; set; } = new();
    }
}
