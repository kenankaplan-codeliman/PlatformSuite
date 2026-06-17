using Crm.Application.Features.Opportunities.Commands.CreateOpportunity;
using Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;
using Crm.Application.Features.Opportunities.Dtos;
using Crm.Domain.Entities.Opportunities;
using Platform.Application.Modals.Common;
using Crm.Domain.Entities.Accounts;
using Crm.Domain.Entities.Contacts;
using Platform.Application.Mapping;
using Mapster;

namespace Crm.Application.Features.Opportunities;

public static class OpportunityMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<OpportunityProduct, OpportunityProductModal>()
            .Map(d => d.Product, s => new EntityReference(nameof(Crm.Domain.Entities.Products.Product))
            {
                Id = s.ProductId,
                Name = s.Product != null ? s.Product.Name : string.Empty,
            })
            .Map(d => d.LineTotal, s => s.LineTotal)
            .Map(d => d.NetAmount, s => s.NetAmount);

        config.NewConfig<Opportunity, OpportunityDetailItem>()
            .Map(d => d.Account, s => s.Account != null
                ? new EntityReference(nameof(Account))
                {
                    Id = s.Account.Id,
                    Name = s.Account.AccountName,
                }
                : null)
            .Map(d => d.PrimaryContact, s => s.PrimaryContact != null
                ? new EntityReference(nameof(Contact))
                {
                    Id = s.PrimaryContact.Id,
                    Name = (s.PrimaryContact.FirstName + " " + s.PrimaryContact.LastName).Trim(),
                }
                : null)
            .Map(d => d.Products, s => s.Products);

        config.NewConfig<Opportunity, OpportunityListItem>()
            .Map(d => d.AccountName, s => s.Account != null ? s.Account.AccountName : null);

        config.NewConfig<CreateOpportunityCommand, Opportunity>()
            .Map(d => d.AccountId, s => s.Account != null ? s.Account.Id : Guid.Empty)
            .Map(d => d.PrimaryContactId, s => s.PrimaryContact != null ? (Guid?)s.PrimaryContact.Id : null)
            .Ignore(d => d.Account!, d => d.PrimaryContact!)
            .Ignore(d => d.Products)
            // OpportunityCode handler'da numarator ile set edilir; command'dan gelmez.
            .Ignore(d => d.OpportunityCode)
            // ActualAmount + ActualNetAmount + TotalDiscount(Amount/Rate): client değerleri
            // yok sayılır; AfterMapping'te Products toplamından hesaplanır.
            .Ignore(d => d.ActualAmount!)
            .Ignore(d => d.ActualNetAmount!)
            .Ignore(d => d.TotalDiscountAmount!)
            .Ignore(d => d.TotalDiscountRate!)
            .Ignore(d => d.TotalDiscount!)
            .IgnoreAuditFields()
            .AfterMapping((src, dst) =>
            {
                SyncProducts(src.Products, dst);
                RecalculateTotals(dst);
            });

        config.NewConfig<UpdateOpportunityCommand, Opportunity>()
            .IgnoreNullValues(true)
            .Map(d => d.AccountId, s => s.Account != null ? s.Account.Id : Guid.Empty)
            .Ignore(d => d.PrimaryContactId!)
            .Ignore(d => d.Account!, d => d.PrimaryContact!)
            .Ignore(d => d.Products)
            // OpportunityCode değişmez; update command'da yok, mevcut değer korunur.
            .Ignore(d => d.OpportunityCode)
            // ActualAmount + ActualNetAmount + TotalDiscount(Amount/Rate): client değerleri
            // yok sayılır; AfterMapping'te Products toplamından hesaplanır.
            .Ignore(d => d.ActualAmount!)
            .Ignore(d => d.ActualNetAmount!)
            .Ignore(d => d.TotalDiscountAmount!)
            .Ignore(d => d.TotalDiscountRate!)
            .Ignore(d => d.TotalDiscount!)
            .IgnoreAuditFields()
            .AfterMapping((src, dst) =>
            {
                dst.PrimaryContactId = src.PrimaryContact?.Id;
                SyncProducts(src.Products, dst);
                RecalculateTotals(dst);
            });
    }

    /// <summary>
    /// Products satırlarından Opportunity'nin tüm toplamlarını yeniden hesaplar:
    ///  - <c>ActualAmount</c>: brüt satır toplamlarının toplamı (Quantity × UnitPrice).
    ///  - <c>ActualNetAmount</c>: satır NetAmount (clamped) toplamı.
    ///  - <c>TotalDiscountRate</c>: satır DiscountRate (yüzde) değerlerinin toplamı.
    ///  - <c>TotalDiscountAmount</c>: satır DiscountAmount (tutar) değerlerinin toplamı.
    ///  - <c>TotalDiscount</c>: ikisinin birlikte para birimi karşılığı = satır
    ///    LineDiscountTotal (oran + tutar) toplamı (ActualAmount − ActualNetAmount).
    /// Satır yoksa hepsi null.
    /// </summary>
    private static void RecalculateTotals(Opportunity opportunity)
    {
        if (opportunity.Products.Count == 0)
        {
            opportunity.ActualAmount = null;
            opportunity.ActualNetAmount = null;
            opportunity.TotalDiscountAmount = null;
            opportunity.TotalDiscountRate = null;
            opportunity.TotalDiscount = null;
            return;
        }

        var gross = opportunity.Products.Sum(p => p.LineTotal);
        var net = opportunity.Products.Sum(p => p.NetAmount);
        var discountRateSum = opportunity.Products.Sum(p => p.DiscountRate);
        var discountAmountSum = opportunity.Products.Sum(p => p.DiscountAmount);
        var discountTotal = opportunity.Products.Sum(p => p.LineDiscountTotal);

        opportunity.ActualAmount = gross;
        opportunity.ActualNetAmount = net;
        opportunity.TotalDiscountRate = Math.Round(discountRateSum, 2, MidpointRounding.AwayFromZero);
        opportunity.TotalDiscountAmount = discountAmountSum;
        opportunity.TotalDiscount = discountTotal;
    }

    private static void SyncProducts(IReadOnlyList<OpportunityProductModal> products, Opportunity opportunity)
    {
        CollectionSync.Merge(
            products, opportunity.Products,
            srcId: s => s.Id,
            dstId: d => d.Id,
            factory: s => new OpportunityProduct
            {
                OpportunityId = opportunity.Id,
                ProductId = s.Product != null ? s.Product.Id : Guid.Empty,
                Quantity = s.Quantity,
                UnitPrice = s.UnitPrice,
                UnitCode = s.UnitCode,
                DiscountRate = s.DiscountRate,
                DiscountAmount = s.DiscountAmount,
            },
            update: (s, d) =>
            {
                d.ProductId = s.Product != null ? s.Product.Id : Guid.Empty;
                d.Quantity = s.Quantity;
                d.UnitPrice = s.UnitPrice;
                d.UnitCode = s.UnitCode;
                d.DiscountRate = s.DiscountRate;
                d.DiscountAmount = s.DiscountAmount;
            });
    }
}
