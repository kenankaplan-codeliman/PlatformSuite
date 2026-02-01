using CRM.Api.Contracts.Requests;
using FluentValidation;

namespace CRM.Api.Contracts.Validators
{
    public class MicrosoftCallbackRequestValidator : AbstractValidator<MsalRequest>
    {
            public MicrosoftCallbackRequestValidator()
            {
                RuleFor(x => x.MsalToken).NotEmpty().MaximumLength(5000);
            }
    }
}
