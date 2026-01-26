namespace CRM.Api.Contracts.Dto
{
    public class UserDto
    {
        public required Guid Id { get; set; }
        public required string Email { get; set; } = string.Empty;
        public required string DisplayName { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public Guid? OrganizationId { get; set; }
        public string? OrganizationName { get; set; }
    }
}
