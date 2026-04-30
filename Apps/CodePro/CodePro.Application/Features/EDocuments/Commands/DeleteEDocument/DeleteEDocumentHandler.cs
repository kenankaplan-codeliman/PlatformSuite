using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.EDocuments.Commands.DeleteEDocument;

public sealed class DeleteEDocumentHandler : IRequestHandler<DeleteEDocumentCommand, Result>
{
    private readonly IEDocumentRepository _repository;

    public DeleteEDocumentHandler(IEDocumentRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteEDocumentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return EDocumentErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
