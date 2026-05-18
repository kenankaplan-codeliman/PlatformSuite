using CodePro.Application.Features.Suppliers.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Suppliers.Commands.UpdateSupplier;

public sealed class UpdateSupplierCommand : ICommand<SupplierDetailItem>, IAttachmentCarrier
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Industry { get; init; }
    public string? Website { get; init; }
    public string? Description { get; init; }
    public decimal? AnnualRevenue { get; init; }
    public int? NumberOfEmployees { get; init; }

    public string SupplierType { get; init; } = "Manufacturer";
    public string SupplierStatus { get; init; } = "Pending";
    public string CompanyType { get; init; } = "Gercek";
    public string? CompanyLegalType { get; init; }
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
