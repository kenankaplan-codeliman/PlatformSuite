namespace Platform.Api.Configuration;

public static class ValidationConfiguration
{
    // FluentValidation validator'ları ve MediatR pipeline behavior'ları
    // Platform.Application/DependencyInjection.cs içindeki AddApplication() tarafından kayıt edilir.
    // Model binding hataları AddProblemDetails() ile otomatik ProblemDetails'e dönüşür.
    public static IServiceCollection AddValidation(this IServiceCollection services) => services;
}

