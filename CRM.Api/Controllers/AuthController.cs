using CRM.Api.Contracts.Requests;
using CRM.Api.Contracts.Responses;
using CRM.Api.Extensions;
using CRM.Application.CommandHandler;
using CRM.Application.Interfaces;
using CRM.Application.Models;
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
            var authenticatedUser = await this.authenticationCommandHandler.LoginAsync(request.Email
                , request.Password
                , new ClientInfo()
                {
                    IpAddress = HttpContext.GetIpAddress(),
                    UserAgent = HttpContext.GetUserAgent()
                });


            return Ok(LoginResponse.fromAuthToken(authenticatedUser.Token, authenticatedUser.User, authenticatedUser.Organization));
        }

        [HttpPost("microsoft/callback")]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        public async Task<IActionResult> MicrosoftCallback([FromBody] MicrosoftCallbackRequest request)
        {
            var authenticatedUser = await this.authenticationCommandHandler.LoginMicrosoftAsync(request.Token
                 , new ClientInfo()
                 {
                     IpAddress = HttpContext.GetIpAddress(),
                     UserAgent = HttpContext.GetUserAgent()
                 });


            return Ok(LoginResponse.fromAuthToken(authenticatedUser.Token, authenticatedUser.User, authenticatedUser.Organization));
        }

        /// <summary>
        /// Logout - Revoke refresh token
        /// </summary>
        [HttpPost("logout")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Logout()
        {
            if (HttpContext.User.Identity?.IsAuthenticated ?? false)
            {
                await this.authenticationCommandHandler.Logout();
                return Ok(new { message = "Logged out successfully" });
            }
            else
            {
                return Unauthorized(new { message = "Logged out error. Unauthenticated user." });

            }

        }

        [HttpPost("refreshtoken")]
        [ProducesResponseType(typeof(RefreshTokenResponse), 200)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (HttpContext.User.Identity?.IsAuthenticated ?? false)
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
            else
            {
                return Unauthorized(new { message = "Logged out error. Unauthenticated user." });

            }

        }

        [HttpGet("health")]
        public IActionResult Health() => Ok();

    }
}