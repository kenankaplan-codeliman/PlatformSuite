using System.Text.Json;
using System.Text.Json.Serialization;

namespace Platform.Api.Configuration;

public static class EnumConfiguration
{
    public static IMvcBuilder SetJsonOptions(this IMvcBuilder builder)
    {
        builder.AddJsonOptions(options =>
         {
             options.JsonSerializerOptions.Converters.Add(
                                                            new JsonStringEnumConverter(
                                                                namingPolicy: JsonNamingPolicy.CamelCase,
                                                                allowIntegerValues: false
                                                            )
                                                        );
         });


        return builder;
    }
}

