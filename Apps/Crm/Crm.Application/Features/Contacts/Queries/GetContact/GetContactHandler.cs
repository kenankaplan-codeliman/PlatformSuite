using Platform.Application.Common.Abstractions;
using Crm.Application.Interfaces;
using Crm.Application.Common.Communications;
using Platform.Application.Common.Results;
using Crm.Application.Features.Contacts.Dtos;
using Crm.Domain.Entities.Contacts;
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
            .Include(c => c.AccountContacts).ThenInclude(ac => ac.Account)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (entity is null) return ContactErrors.NotFound;

        var dto = entity.Adapt<ContactDetailItem>();
        (dto.Emails, dto.Phones, dto.Addresses) =
            await _db.LoadCommunicationsAsync(nameof(Contact), entity.Id, cancellationToken);
        return dto;
    }
}
