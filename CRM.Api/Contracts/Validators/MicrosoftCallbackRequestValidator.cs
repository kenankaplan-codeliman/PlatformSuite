using CRM.Api.Contracts.Requests;
using FluentValidation;

namespace CRM.Api.Contracts.Validators
{
    public class MicrosoftCallbackRequestValidator : AbstractValidator<MicrosoftCallbackRequest>
    {
            public MicrosoftCallbackRequestValidator()
            {
                RuleFor(x => x.Token).NotEmpty().MaximumLength(5000);
            }
    }
}
