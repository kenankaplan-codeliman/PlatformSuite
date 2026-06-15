using Crm.Application.Common.Dtos.Communications;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Enums;
using Crm.Domain.Parameters;
using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Platform.Application.Modals.Common;
using MediatR;

namespace Crm.Application.Features.Leads.Commands.ImportLeads;

/// <summary>
/// Satırları tek transaction içinde Lead'e çevirir. CreateLead handler'ı ile aynı altyapıyı
/// (ILeadRepository + ICommunicationRepository) doğrudan kullanır — iç içe ICommand göndermez,
/// çünkü UnitOfWork.BeginTransactionAsync reentrant değildir.
/// </summary>
public sealed class ImportLeadsHandler : IRequestHandler<ImportLeadsCommand, Result<ImportLeadsResult>>
{
    private readonly ILeadRepository _repository;
    private readonly ICommunicationRepository _communications;
    private readonly IGeneralParameterReader _parameters;

    public ImportLeadsHandler(
        ILeadRepository repository,
        ICommunicationRepository communications,
        IGeneralParameterReader parameters)
    {
        _repository = repository;
        _communications = communications;
        _parameters = parameters;
    }

    public async Task<Result<ImportLeadsResult>> Handle(ImportLeadsCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(LeadParameterCodes.Status, request.Status, cancellationToken))
            return LeadErrors.InvalidStatus;

        var result = new ImportLeadsResult();

        for (var index = 0; index < request.Rows.Count; index++)
        {
            var row = request.Rows[index];
            var subject = ResolveSubject(row);

            if (string.IsNullOrWhiteSpace(subject))
            {
                result.Failed++;
                result.Errors.Add($"Satır {index + 1}: Ad/Soyad veya Firma adı gerekli, atlandı.");
                continue;
            }

            var entity = new Lead
            {
                Subject = subject,
                FirstName = Trim(row.FirstName),
                LastName = Trim(row.LastName),
                Title = Trim(row.Title),
                Department = Trim(row.Department),
                Company = Trim(row.Company),
                Industry = Trim(row.Industry),
                Website = Trim(row.Website),
                Status = request.Status,
                Source = "Other",
            };

            await _repository.CreateAsync(entity, cancellationToken);

            var emails = string.IsNullOrWhiteSpace(row.Email)
                ? new List<EmailModal>()
                : new List<EmailModal> { new() { Email = row.Email!.Trim(), Type = EmailType.Work, IsPrimary = true } };

            var phones = string.IsNullOrWhiteSpace(row.Phone)
                ? new List<PhoneModal>()
                : new List<PhoneModal> { new() { PhoneNumber = row.Phone!.Trim(), Type = PhoneType.Work, IsPrimary = true } };

            if (emails.Count > 0 || phones.Count > 0)
                await _communications.SyncAsync(
                    nameof(Lead), entity.Id, emails, phones, new List<AddressModal>(), cancellationToken);

            result.Created++;
            result.CreatedLinks.Add(new EntityReference(nameof(Lead)) { Id = entity.Id, Name = entity.Subject });
        }

        return result;
    }

    private static string? ResolveSubject(ImportLeadRow row)
    {
        if (!string.IsNullOrWhiteSpace(row.Subject))
            return row.Subject.Trim();

        var fullName = $"{row.FirstName} {row.LastName}".Trim();
        if (!string.IsNullOrWhiteSpace(fullName))
            return fullName;

        return string.IsNullOrWhiteSpace(row.Company) ? null : row.Company.Trim();
    }

    private static string? Trim(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
