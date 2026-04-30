using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Offers.Dtos;

public class OfferListFilter
{
    public string? Search { get; set; }
    public OfferType? OfferType { get; set; }
    public OfferStatus? Status { get; set; }
    public bool? IsActive { get; set; }
}
