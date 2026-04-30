namespace Platform.Api.Configuration;

public static class CorsConfiguration
{
    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy
                    .AllowAnyOrigin() //.WithOrigins("http://localhost:5501")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                    //.AllowCredentials();
            });
        });



        return services;
    }
}
