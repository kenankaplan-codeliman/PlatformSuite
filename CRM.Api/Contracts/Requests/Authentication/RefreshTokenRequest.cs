namespace CRM.Api.Contracts.Requests.Authentication
{
    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = null!;
    }
}
