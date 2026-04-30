using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Questionnaires;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class QuestionnaireRepository : BaseEntityRepository<Questionnaire>, IQuestionnaireRepository
{
    public QuestionnaireRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Questionnaire?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet
            .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == Id, cancellationToken);
    }
}
