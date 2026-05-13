using CodePro.Application.Features.Questionnaires.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Questionnaires.Queries.ListQuestionnaires;

public sealed class ListQuestionnairesHandler : IRequestHandler<ListQuestionnairesQuery, Result<PagedResult<QuestionnaireListItem>>>
{
    private readonly ICodeProDbContext _db;

    public ListQuestionnairesHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<PagedResult<QuestionnaireListItem>>> Handle(ListQuestionnairesQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Questionnaire.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.Name))
        {
            var pattern = $"%{filters.Name}%";
            query = query.Where(q => EF.Functions.ILike(q.Name, pattern));
        }

        if (filters.RelatedModule.HasValue)
            query = query.Where(q => q.RelatedModule == filters.RelatedModule.Value);

        if (filters.Status.HasValue)
            query = query.Where(q => q.Status == filters.Status.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(q => q.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<QuestionnaireListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<QuestionnaireListItem>
        {
            Data = items,
            Pagination = new PaginationResponse
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                HasMoreRecord = hasMore,
            },
        };
    }
}
