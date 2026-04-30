using System.Security.Claims;

namespace Platform.Api.Extensions
{
    public static class HttpContextExtension
    {
        /// <summary>
        /// Client IP Address
        /// </summary>
        public static string? GetIpAddress(this HttpContext httpContext)
        {
            var ipAddress = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                         ?? httpContext.Connection.RemoteIpAddress?.ToString();

            return ipAddress;
        }

        public static string? GetUserAgent(this HttpContext httpContext)
        {
            var userAgent = httpContext.Request.Headers["User-Agent"].ToString();

            return userAgent;
        }
    }
}
