using CodePro.Application.Features.Questionnaires.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Questionnaires.Queries.GetQuestionnaire;

public sealed class GetQuestionnaireHandler : IRequestHandler<GetQuestionnaireQuery, Result<QuestionnaireDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetQuestionnaireHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<QuestionnaireDetailItem>> Handle(GetQuestionnaireQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Questionnaire.AsNoTracking()
            .Include(q => q.Questions.OrderBy(x => x.OrderIndex))
                .ThenInclude(q => q.Options.OrderBy(o => o.OrderIndex))
            .FirstOrDefaultAsync(q => q.Id == request.Id, cancellationToken);

        if (entity is null) return QuestionnaireErrors.NotFound;
        return entity.Adapt<QuestionnaireDetailItem>();
    }
}
