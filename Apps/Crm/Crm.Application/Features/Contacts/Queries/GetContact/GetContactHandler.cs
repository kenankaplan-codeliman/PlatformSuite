using Platform.Application.Common.Abstractions;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Crm.Application.Features.Contacts.Dtos;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Contacts.Queries.GetContact;

public sealed class GetContactHandler : IRequestHandler<GetContactQuery, Result<ContactDetailItem>>
{
    private readonly ICrmDbContext _db;

    public GetContactHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<ContactDetailItem>> Handle(GetContactQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Contact
            .AsNoTracking()
            .Include(c => c.Emails)
            .Include(c => c.Phones)
            .Include(c => c.Addresses)
            .Include(c => c.AccountContacts).ThenInclude(ac => ac.Account)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (entity is null) return ContactErrors.NotFound;

        return entity.Adapt<ContactDetailItem>();
    }
}
