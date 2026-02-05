using CRM.Api.Contracts.Requests.Authentication;
using CRM.Api.Contracts.Responses;
using CRM.Api.Extensions;
using CRM.Application.CommandHandler;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Application.Modals.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> logger;
        private readonly AuthenticationCommandHandler authenticationCommandHandler;

        public AuthController(AuthenticationCommandHandler authenticationCommandHandler,
            ILogger<AuthController> logger,
            IMicrosoftGraphService graphService)
        {
            this.authenticationCommandHandler = authenticationCommandHandler;
            this.logger = logger;
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var authToken = await this.authenticationCommandHandler.LoginAsync(request.Email,
                request.Password,
                new ClientInfo()
                {
                    IpAddress = HttpContext.GetIpAddress(),
                    UserAgent = HttpContext.GetUserAgent()
                });


            return Ok(LoginResponse.fromAuthToken(authToken));
        }

        [HttpPost("microsoft/callback")]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        public async Task<IActionResult> MicrosoftCallback([FromBody] MsalRequest request)
        {
            var authToken = await this.authenticationCommandHandler.LoginMicrosoftAsync(request.MsalToken,
                 new ClientInfo()
                 {
                     IpAddress = HttpContext.GetIpAddress(),
                     UserAgent = HttpContext.GetUserAgent()
                 });


            return Ok(LoginResponse.fromAuthToken(authToken));
        }

        /// <summary>
        /// Logout - Revoke refresh token
        /// </summary>
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] AccessTokenRequest request)
        {
                await this.authenticationCommandHandler.Logout(
                    request.AccessToken,
                    new ClientInfo()
                    {
                        IpAddress = HttpContext.GetIpAddress(),
                        UserAgent = HttpContext.GetUserAgent()
                    });

                return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("refresh")]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var authResult = await this.authenticationCommandHandler.RefreshToken(
                request.RefreshToken,
                new ClientInfo()
                {
                    IpAddress = HttpContext.GetIpAddress(),
                    UserAgent = HttpContext.GetUserAgent()
                });

            return Ok(RefreshTokenResponse.fromAuthToken(authResult));
        }

        [HttpPost("me")]
        [ProducesResponseType(typeof(ClientUserInfo), 200)]
        public async Task<IActionResult> Me()
        {
            if (HttpContext.User.Identity?.IsAuthenticated ?? false)
            {
                var user = await this.authenticationCommandHandler.CurrentUser();

                return Ok(user);
            }
            else
            {
                return Unauthorized(new { message = "Unauthenticated user not found." });

            }

        }


        [HttpGet("health")]
        public IActionResult Health() => Ok();

    }
}