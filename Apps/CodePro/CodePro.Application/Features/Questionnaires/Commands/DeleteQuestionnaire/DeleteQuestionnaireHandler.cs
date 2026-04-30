using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.Questionnaires.Commands.DeleteQuestionnaire;

public sealed class DeleteQuestionnaireHandler : IRequestHandler<DeleteQuestionnaireCommand, Result>
{
    private readonly IQuestionnaireRepository _repository;

    public DeleteQuestionnaireHandler(IQuestionnaireRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteQuestionnaireCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return QuestionnaireErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
