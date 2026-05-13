using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.Attachments.Commands.DeleteAttachment;

public sealed class DeleteAttachmentHandler : IRequestHandler<DeleteAttachmentCommand, Result>
{
    private readonly IAttachmentRepository _repository;

    public DeleteAttachmentHandler(IAttachmentRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteAttachmentCommand request, CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(request.Id, cancellationToken);
        return deleted ? Result.Success() : AttachmentErrors.NotFound;
    }
}
