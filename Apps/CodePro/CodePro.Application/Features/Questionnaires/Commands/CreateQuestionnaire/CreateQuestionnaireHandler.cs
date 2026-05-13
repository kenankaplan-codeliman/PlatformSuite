using CodePro.Application.Features.Questionnaires.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Questionnaires;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Questionnaires.Commands.CreateQuestionnaire;

public sealed class CreateQuestionnaireHandler : IRequestHandler<CreateQuestionnaireCommand, Result<QuestionnaireDetailItem>>
{
    private readonly IQuestionnaireRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public CreateQuestionnaireHandler(
        IQuestionnaireRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<QuestionnaireDetailItem>> Handle(CreateQuestionnaireCommand request, CancellationToken cancellationToken)
    {
        var nameExists = await _db.Questionnaire.AsNoTracking()
            .AnyAsync(q => q.Name.ToLower() == request.Name.ToLower(), cancellationToken);
        if (nameExists) return QuestionnaireErrors.DuplicateName;

        var entity = new Questionnaire
        {
            Name = request.Name,
            RelatedModule = request.RelatedModule,
            Status = request.Status,
        };
        await _repository.CreateAsync(entity, cancellationToken);

        if (request.Questions.Count > 0)
        {
            await QuestionnaireSyncHelper.SyncQuestionsAsync(_db, entity.Id, request.Questions, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);
        }

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(Questionnaire), cancellationToken);
        }

        return await BuildDetailAsync(entity.Id, cancellationToken);
    }

    private async Task<QuestionnaireDetailItem> BuildDetailAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _db.Questionnaire.AsNoTracking()
            .Include(q => q.Questions.OrderBy(x => x.OrderIndex))
                .ThenInclude(q => q.Options.OrderBy(o => o.OrderIndex))
            .FirstAsync(q => q.Id == id, cancellationToken);

        return entity.Adapt<QuestionnaireDetailItem>();
    }
}
