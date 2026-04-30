using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Offers;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Infrastructure.Repositories;

public class OfferRepository : BaseEntityRepository<Offer>, IOfferRepository
{
    public OfferRepository(PlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Offer?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
    {
        return await dbSet.FirstOrDefaultAsync(o => o.Id == Id, cancellationToken);
    }
}
