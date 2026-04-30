# Build context: repo root (PlatformSuite/)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Project files first for layer caching
COPY ["Platform/Platform.Domain/Platform.Domain.csproj", "Platform/Platform.Domain/"]
COPY ["Platform/Platform.Application/Platform.Application.csproj", "Platform/Platform.Application/"]
COPY ["Platform/Platform.Infrastructure/Platform.Infrastructure.csproj", "Platform/Platform.Infrastructure/"]
COPY ["Platform/Platform.Api/Platform.Api.csproj", "Platform/Platform.Api/"]
COPY ["Apps/Crm/Crm.Domain/Crm.Domain.csproj", "Apps/Crm/Crm.Domain/"]
COPY ["Apps/Crm/Crm.Application/Crm.Application.csproj", "Apps/Crm/Crm.Application/"]
COPY ["Apps/Crm/Crm.Infrastructure/Crm.Infrastructure.csproj", "Apps/Crm/Crm.Infrastructure/"]
COPY ["Apps/Crm/Crm.Api/Crm.Api.csproj", "Apps/Crm/Crm.Api/"]

RUN dotnet restore "Apps/Crm/Crm.Api/Crm.Api.csproj"

COPY Platform/ Platform/
COPY Apps/Crm/ Apps/Crm/

WORKDIR /src/Apps/Crm/Crm.Api
RUN dotnet publish "Crm.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Crm.Api.dll"]
