using Platform.Application.Common.Assistant;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.Assistant.Queries.Chat;

public sealed class ChatAssistantHandler : IRequestHandler<ChatAssistantQuery, Result<ChatAssistantResult>>
{
    private readonly IAssistantOrchestrator _orchestrator;
    private readonly IAssistantRequestContext _context;
    private readonly IAttachmentRepository _attachments;

    public ChatAssistantHandler(
        IAssistantOrchestrator orchestrator,
        IAssistantRequestContext context,
        IAttachmentRepository attachments)
    {
        _orchestrator = orchestrator;
        _context = context;
        _attachments = attachments;
    }

    public async Task<Result<ChatAssistantResult>> Handle(ChatAssistantQuery request, CancellationToken cancellationToken)
    {
        // Ek varsa baytları yükle ve scoped bağlama koy (görsel→vision, CSV→araç).
        if (request.AttachmentId is Guid attachmentId)
        {
            var meta = await _attachments.GetMetadataAsync(attachmentId, cancellationToken);
            var data = await _attachments.GetFileDataAsync(attachmentId, cancellationToken);
            if (meta is not null && data is not null)
                _context.SetAttachment(attachmentId, meta.ContentType, meta.FileName, data.DataBytes);
        }

        var run = await _orchestrator.RunAsync(request.Message, request.History, cancellationToken);

        var history = new List<AssistantTurn>(request.History)
        {
            new("user", request.Message),
            new("assistant", run.Reply),
        };

        return new ChatAssistantResult
        {
            Reply = run.Reply,
            Links = run.Links,
            History = history,
            PendingActions = run.PendingActions,
        };
    }
}
