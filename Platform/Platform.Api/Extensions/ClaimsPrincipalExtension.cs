using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;



namespace Platform.Api.Extensions
{
    public static class ClaimsPrincipalExtension
    {
        /// <summary>
        /// JWT 'sub' → ClaimTypes.NameIdentifier
        /// </summary>
        public static string? GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirstValue("sub");
        }

        /// <summary>
        /// JWT 'name' → ClaimTypes.Name
        /// </summary>
        public static string? GetFullName(this ClaimsPrincipal user)
        {
            return user.FindFirstValue("name");
        }

        /// <summary>
        /// JWT 'email' → ClaimTypes.Email
        /// </summary>
        public static string? GetEmail(this ClaimsPrincipal user)
        {
            return user.FindFirstValue("email");
        }

        public static bool IsAuthenticated(this ClaimsPrincipal user)
        {
            return user.Identity?.IsAuthenticated ?? false;
        }

        /// <summary>
        /// Role kontrolü (tek role)
        /// </summary>
        public static bool HasRole(this ClaimsPrincipal user, string role)
        {
            return user.IsInRole(role);
        }
    }

}