using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.AppOrganizations.Commands.DeleteAppOrganization;

public sealed record DeleteAppOrganizationCommand(Guid Id) : ICommand;
