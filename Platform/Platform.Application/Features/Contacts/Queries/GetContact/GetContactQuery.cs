using Platform.Application.Common.Abstractions;
using Platform.Application.Features.Contacts.Dtos;

namespace Platform.Application.Features.Contacts.Queries.GetContact;

public sealed record GetContactQuery(Guid Id) : IQuery<ContactDetailItem>;
