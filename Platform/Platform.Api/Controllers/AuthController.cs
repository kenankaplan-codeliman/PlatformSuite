using Platform.Api.Contracts.Requests.Authentication;
using Platform.Api.Contracts.Responses;
using Platform.Api.Extensions;
using Platform.Application.Common.Results;
using Platform.Application.Features.Authentication.Commands.Login;
using Platform.Application.Features.Authentication.Commands.LoginMicrosoft;
using Platform.Application.Features.Authentication.Commands.Logout;
using Platform.Application.Features.Authentication.Commands.RefreshToken;
using Platform.Application.Features.Authentication.Queries.GetCurrentUser;
using Platform.Application.Modals;
using Platform.Application.Modals.Authentication;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

[ApiController]
[Route("auth")]
public sealed class AuthController : ControllerBase
{
    private readonly ISender _sender;

    public AuthController(ISender sender) => _sender = sender;

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var command = new LoginCommand(request.Email, request.Password, BuildClientInfo());
        var result = await _sender.Send(command, ct);
        return result.IsSuccess
            ? Ok(AuthResponse.fromAuthToken(result.Value))
            : result.ToActionResult(HttpContext);
    }

    [HttpPost("microsoft/callback")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    public async Task<IActionResult> MicrosoftCallback([FromBody] MsalRequest request, CancellationToken ct)
    {
        var command = new LoginMicrosoftCommand(request.MsalToken, BuildClientInfo());
        var result = await _sender.Send(command, ct);
        return result.IsSuccess
            ? Ok(AuthResponse.fromAuthToken(result.Value))
            : result.ToActionResult(HttpContext);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] AccessTokenRequest request, CancellationToken ct)
    {
        var command = new LogoutCommand(request.AccessToken, BuildClientInfo());
        var result = await _sender.Send(command, ct);
        return result.IsSuccess
            ? Ok(new { message = "Logged out successfully" })
            : result.ToActionResult(HttpContext);
    }

    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        var command = new RefreshTokenCommand(request.RefreshToken, BuildClientInfo());
        var result = await _sender.Send(command, ct);
        return result.IsSuccess
            ? Ok(AuthResponse.fromAuthToken(result.Value))
            : result.ToActionResult(HttpContext);
    }

    [HttpPost("me")]
    [ProducesResponseType(typeof(ClientUserInfo), 200)]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        if (!(HttpContext.User.Identity?.IsAuthenticated ?? false))
            return Unauthorized(new { message = "Unauthenticated user not found." });

        return (await _sender.Send(new GetCurrentUserQuery(), ct)).ToActionResult(HttpContext);
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok();

    private ClientInfo BuildClientInfo() => new()
    {
        IpAddress = HttpContext.GetIpAddress(),
        UserAgent = HttpContext.GetUserAgent(),
    };
}
