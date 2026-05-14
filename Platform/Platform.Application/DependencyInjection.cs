using System.Reflection;
using Platform.Application.Common.Behaviors;
using Platform.Application.Common.Parameters;
using Platform.Application.Mapping;
using FluentValidation;
using Mapster;
using MapsterMapper;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Platform.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        // MediatR: handler'ları ve pipeline behavior'ları kayıt et.
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);
            cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
            cfg.AddOpenBehavior(typeof(TransactionBehavior<,>));
        });

        // FluentValidation: Application assembly'sindeki tüm validator'ları kayıt et.
        services.AddValidatorsFromAssembly(assembly);

        // Mapster: tek TypeAdapterConfig instance'ı + scoped ServiceMapper.
        var typeAdapterConfig = TypeAdapterConfig.GlobalSettings;
        MappingConfig.Register(typeAdapterConfig);
        services.AddSingleton(typeAdapterConfig);
        services.AddScoped<IMapper, ServiceMapper>();

        // GeneralParameter: enum yerine string tutan alanların handler-seviyesi
        // business-rule doğrulaması için paylaşılan reader.
        services.AddScoped<IGeneralParameterReader, GeneralParameterReader>();

        return services;
    }
}
