namespace Platform.Domain.Authorization
{
    public static class PrivilegeCodes
    {
        public static class UserPrivilegeCodes
        {
            public const string Read = "User.Read";
            public const string Create = "User.Create";
            public const string Update = "User.Update";
            public const string Delete = "User.Delete";
        }

        public static class ActivityPrivilegeCodes
        {
            public const string Read = "Activity.Read";
            public const string Create = "Activity.Create";
            public const string Update = "Activity.Update";
            public const string Delete = "Activity.Delete";
            public const string UpdateStatus = "Activity.UpdateStatus";
        }

        public static class AccountPrivilegeCodes
        {
            public const string Read = "Account.Read";
            public const string Create = "Account.Create";
            public const string Update = "Account.Update";
            public const string Delete = "Account.Delete";
            public const string Assign = "Account.Assign";
            public const string State = "Account.State";
        }

        public static class ContactPrivilegeCodes
        {
            public const string Read = "Contact.Read";
            public const string Create = "Contact.Create";
            public const string Update = "Contact.Update";
            public const string Delete = "Contact.Delete";
            public const string Assign = "Contact.Assign";
            public const string State = "Contact.State";
        }

        public static class AppOrganizationPrivilegeCodes
        {
            public const string Read = "AppOrganization.Read";
            public const string Create = "AppOrganization.Create";
            public const string Update = "AppOrganization.Update";
            public const string Delete = "AppOrganization.Delete";
        }

        public static class AppRolePrivilegeCodes
        {
            public const string Read = "AppRole.Read";
            public const string Create = "AppRole.Create";
            public const string Update = "AppRole.Update";
            public const string Delete = "AppRole.Delete";
        }

        public static class AttachmentPrivilegeCodes
        {
            public const string Read = "Attachment.Read";
            public const string Create = "Attachment.Create";
            public const string Delete = "Attachment.Delete";
        }
    }
}
