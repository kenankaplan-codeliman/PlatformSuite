using CodePro.Domain.Enums;

namespace CodePro.Application.Features.PurchaseBaskets.Dtos;

public class PurchaseBasketListFilter
{
    public PurchaseBasketStatus? Status { get; set; }
    public bool? IsActive { get; set; }
}
