FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files first for layer caching
COPY ["CRM.Api/CRM.Api.csproj", "CRM.Api/"]
COPY ["CRM.Application/CRM.Application.csproj", "CRM.Application/"]
COPY ["CRM.Domain/CRM.Domain.csproj", "CRM.Domain/"]
COPY ["CRM.Infrastructure/CRM.Infrastructure.csproj", "CRM.Infrastructure/"]

RUN dotnet restore "CRM.Api/CRM.Api.csproj"

COPY CRM.Api/ CRM.Api/
COPY CRM.Application/ CRM.Application/
COPY CRM.Domain/ CRM.Domain/
COPY CRM.Infrastructure/ CRM.Infrastructure/

WORKDIR /src/CRM.Api
RUN dotnet publish "CRM.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CRM.Api.dll"]
