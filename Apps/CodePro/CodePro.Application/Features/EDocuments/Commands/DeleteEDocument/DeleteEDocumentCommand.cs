using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.EDocuments.Commands.DeleteEDocument;

public sealed record DeleteEDocumentCommand(Guid Id) : ICommand;
