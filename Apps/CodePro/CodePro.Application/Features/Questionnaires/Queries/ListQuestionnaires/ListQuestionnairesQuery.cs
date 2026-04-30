using CodePro.Application.Features.Questionnaires.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.Questionnaires.Queries.ListQuestionnaires;

public sealed class ListQuestionnairesQuery : IQuery<PagedResult<QuestionnaireListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public QuestionnaireListFilter Filters { get; init; } = new();
}
