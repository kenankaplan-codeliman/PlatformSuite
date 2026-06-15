using Platform.Application.Common.Assistant;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.Assistant.Queries.Confirm;

public sealed class ConfirmAssistantHandler : IRequestHandler<ConfirmAssistantActionQuery, Result<ConfirmAssistantResult>>
{
    private static readonly Error InvalidToken =
        new("Assistant.InvalidConfirmation", "Onay geçersiz veya süresi dolmuş.", ErrorType.Unauthorized);

    private static readonly Error UnknownTool =
        new("Assistant.UnknownTool", "Onaylanan işlem bulunamadı.", ErrorType.NotFound);

    private readonly IActionConfirmationService _confirmation;
    private readonly IContextUser _contextUser;
    private readonly IAssistantToolRegistry _registry;
    private readonly IAssistantRequestContext _context;
    private readonly IAttachmentRepository _attachments;

    public ConfirmAssistantHandler(
        IActionConfirmationService confirmation,
        IContextUser contextUser,
        IAssistantToolRegistry registry,
        IAssistantRequestContext context,
        IAttachmentRepository attachments)
    {
        _confirmation = confirmation;
        _contextUser = contextUser;
        _registry = registry;
        _context = context;
        _attachments = attachments;
    }

    public async Task<Result<ConfirmAssistantResult>> Handle(ConfirmAssistantActionQuery request, CancellationToken cancellationToken)
    {
        var payload = _confirmation.Verify(request.Token, _contextUser.UserId);
        if (payload is null)
            return InvalidToken;

        // İşlem bir eke bağlıysa (CSV import) onay anında yeniden yükle.
        if (payload.AttachmentId is Guid attachmentId)
        {
            var meta = await _attachments.GetMetadataAsync(attachmentId, cancellationToken);
            var data = await _attachments.GetFileDataAsync(attachmentId, cancellationToken);
            if (meta is not null && data is not null)
                _context.SetAttachment(attachmentId, meta.ContentType, meta.FileName, data.DataBytes);
        }

        var tool = _registry.GetTool(payload.Tool);
        if (tool is null)
            return UnknownTool;

        var result = await tool.ExecuteAsync(payload.ArgumentsJson, cancellationToken);

        return new ConfirmAssistantResult
        {
            Reply = result.Text,
            Links = result.Links,
            IsError = result.IsError,
        };
    }
}
