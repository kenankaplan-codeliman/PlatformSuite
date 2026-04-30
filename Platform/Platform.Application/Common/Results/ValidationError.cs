using FluentValidation.Results;

namespace Platform.Application.Common.Results;

public sealed record ValidationError : Error
{
    public IReadOnlyDictionary<string, string[]> Failures { get; }

    public ValidationError(IReadOnlyDictionary<string, string[]> failures)
        : base("Validation.Failed", "Bir veya birden fazla doğrulama hatası oluştu.", ErrorType.Validation)
    {
        Failures = failures;
    }

    public static ValidationError FromFailures(IEnumerable<ValidationFailure> failures)
    {
        var grouped = failures
            .GroupBy(f => f.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(f => f.ErrorMessage).ToArray());

        return new ValidationError(grouped);
    }
}
