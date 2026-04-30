using CodePro.Application.Features.Questionnaires.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Questionnaires.Commands.UpdateQuestionnaire;

public sealed class UpdateQuestionnaireHandler : IRequestHandler<UpdateQuestionnaireCommand, Result<QuestionnaireDetailItem>>
{
    private readonly IQuestionnaireRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdateQuestionnaireHandler(IQuestionnaireRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<QuestionnaireDetailItem>> Handle(UpdateQuestionnaireCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return QuestionnaireErrors.NotFound;

        var nameExists = await _db.Questionnaire.AsNoTracking()
            .AnyAsync(q => q.Id != request.Id && q.Name.ToLower() == request.Name.ToLower(), cancellationToken);
        if (nameExists) return QuestionnaireErrors.DuplicateName;

        entity.Name = request.Name;
        entity.RelatedModule = request.RelatedModule;
        entity.Status = request.Status;
        await _repository.UpdateAsync(entity, cancellationToken);

        await QuestionnaireSyncHelper.SyncQuestionsAsync(_db, entity.Id, request.Questions, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

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
