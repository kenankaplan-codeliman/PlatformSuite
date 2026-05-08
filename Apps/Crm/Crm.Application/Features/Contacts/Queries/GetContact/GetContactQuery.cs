using Platform.Application.Common.Abstractions;
using Crm.Application.Features.Contacts.Dtos;

namespace Crm.Application.Features.Contacts.Queries.GetContact;

public sealed record GetContactQuery(Guid Id) : IQuery<ContactDetailItem>;
