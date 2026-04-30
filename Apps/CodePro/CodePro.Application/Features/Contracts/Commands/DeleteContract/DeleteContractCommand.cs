using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Contracts.Commands.DeleteContract;

public sealed record DeleteContractCommand(Guid Id) : ICommand;
