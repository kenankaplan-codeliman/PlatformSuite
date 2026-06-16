using FluentValidation;

namespace Platform.Application.Features.UserPreferences.Commands.SaveUserPreference;

public sealed class SaveUserPreferenceValidator : AbstractValidator<SaveUserPreferenceCommand>
{
    public SaveUserPreferenceValidator()
    {
        RuleFor(x => x.Key).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Value).NotEmpty().MaximumLength(20_000);
    }
}
