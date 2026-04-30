using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.EDocuments;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class EDocumentRepository : BaseEntityRepository<EDocument>, IEDocumentRepository
{
    public EDocumentRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<EDocument?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(e => e.Id == Id, cancellationToken);
    }
}
