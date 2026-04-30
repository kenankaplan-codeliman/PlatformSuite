using Platform.Api.Contracts.Requests.Authentication;
using FluentValidation;

namespace Platform.Api.Contracts.Validators
{
    public class RefreshTokenRequestValidator : AbstractValidator<RefreshTokenRequest>
    {
        public RefreshTokenRequestValidator()
        {
            RuleFor(x => x.RefreshToken).NotEmpty().MaximumLength(500);
        }
    }
}
