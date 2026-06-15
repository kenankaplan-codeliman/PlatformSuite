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
            public const string Assign = "Activity.Assign";
            public const string State = "Activity.State";
        }

        public static class AppOrganizationPrivilegeCodes
        {
            public const string Read = "Organization.Read";
            public const string Create = "Organization.Create";
            public const string Update = "Organization.Update";
            public const string Delete = "Organization.Delete";
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

        public static class GeneralParameterPrivilegeCodes
        {
            public const string Read = "GeneralParameter.Read";
        }

        public static class AssistantPrivilegeCodes
        {
            public const string Use = "Assistant.Use";
        }
    }
}
