using CodePro.Application.Features.Suppliers.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Suppliers.Commands.CreateSupplier;

public sealed class CreateSupplierCommand : ICommand<SupplierDetailItem>, IAttachmentCarrier
{
    public string Name { get; init; } = string.Empty;
    public string? Industry { get; init; }
    public string? Website { get; init; }
    public string? Description { get; init; }
    public decimal? AnnualRevenue { get; init; }
    public int? NumberOfEmployees { get; init; }

    public SupplierType SupplierType { get; init; }
    public SupplierStatus SupplierStatus { get; init; } = SupplierStatus.Pending;
    public CompanyType CompanyType { get; init; }
    public CompanyLegalType? CompanyLegalType { get; init; }
    public string? TaxOffice { get; init; }
    public string? Vkn { get; init; }
    public string? MersisNo { get; init; }

    public string? ContactPersonName { get; init; }
    public string? ContactPersonEmail { get; init; }
    public string? ContactPersonPhone { get; init; }

    public string? AddressLine { get; init; }
    public string? City { get; init; }
    public string? Country { get; init; }
    public string? PostalCode { get; init; }

    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
