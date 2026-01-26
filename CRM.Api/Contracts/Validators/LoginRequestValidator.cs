using CRM.Api.Contracts.Requests;
using FluentValidation;

namespace CRM.Api.Contracts.Validators;



public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Password).NotEmpty().MaximumLength(100);
    }
}