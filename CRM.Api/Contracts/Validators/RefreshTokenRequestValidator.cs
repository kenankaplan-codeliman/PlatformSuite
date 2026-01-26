using CRM.Api.Contracts.Requests;
using FluentValidation;

namespace CRM.Api.Contracts.Validators
{
    public class RefreshTokenRequestValidator : AbstractValidator<RefreshTokenRequest>
    {
        public RefreshTokenRequestValidator()
        {
            RuleFor(x => x.RefreshToken).NotEmpty().MaximumLength(200);
        }
    }
}
