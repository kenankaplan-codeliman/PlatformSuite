# Build context: repo root (PlatformSuite/)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Project files first for layer caching
COPY ["Platform/Platform.Domain/Platform.Domain.csproj", "Platform/Platform.Domain/"]
COPY ["Platform/Platform.Application/Platform.Application.csproj", "Platform/Platform.Application/"]
COPY ["Platform/Platform.Infrastructure/Platform.Infrastructure.csproj", "Platform/Platform.Infrastructure/"]
COPY ["Platform/Platform.Api/Platform.Api.csproj", "Platform/Platform.Api/"]
COPY ["Apps/CodePro/CodePro.Domain/CodePro.Domain.csproj", "Apps/CodePro/CodePro.Domain/"]
COPY ["Apps/CodePro/CodePro.Application/CodePro.Application.csproj", "Apps/CodePro/CodePro.Application/"]
COPY ["Apps/CodePro/CodePro.Infrastructure/CodePro.Infrastructure.csproj", "Apps/CodePro/CodePro.Infrastructure/"]
COPY ["Apps/CodePro/CodePro.Api/CodePro.Api.csproj", "Apps/CodePro/CodePro.Api/"]

RUN dotnet restore "Apps/CodePro/CodePro.Api/CodePro.Api.csproj"

COPY Platform/ Platform/
COPY Apps/CodePro/ Apps/CodePro/

WORKDIR /src/Apps/CodePro/CodePro.Api
RUN dotnet publish "CodePro.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CodePro.Api.dll"]
