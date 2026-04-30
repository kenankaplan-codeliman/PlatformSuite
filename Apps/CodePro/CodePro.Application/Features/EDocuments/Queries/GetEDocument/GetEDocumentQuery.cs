using CodePro.Application.Features.EDocuments.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.EDocuments.Queries.GetEDocument;

public sealed record GetEDocumentQuery(Guid Id) : IQuery<EDocumentDetailItem>;
