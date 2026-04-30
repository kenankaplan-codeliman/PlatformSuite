using Platform.Api.Contracts.Requests.Authentication;
using FluentValidation;

namespace Platform.Api.Contracts.Validators
{
    public class MicrosoftCallbackRequestValidator : AbstractValidator<MsalRequest>
    {
            public MicrosoftCallbackRequestValidator()
            {
                RuleFor(x => x.MsalToken).NotEmpty().MaximumLength(5000);
            }
    }
}
