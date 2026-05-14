using Platform.Application.Features.GeneralParameters.Dtos;
using Platform.Domain.Entities.Parameters;
using Mapster;

namespace Platform.Application.Features.GeneralParameters;

public static class GeneralParameterMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<GeneralParameter, GeneralParameterListItem>();
    }
}
