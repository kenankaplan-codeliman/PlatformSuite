using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Entities.Opportunities;

namespace CRM.Application.Modals.OpportunityModal;

public static class OpportunityMappingExtensions
{
    // ========================
    // Entity → Modal
    // ========================

    public static OpportunityDetailItem ToModal(this Opportunity entity)
    {
        return new OpportunityDetailItem
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Stage = entity.Stage,
            Probability = entity.Probability,
            EstimatedValue = entity.EstimatedValue,
            ActualValue = entity.ActualValue,
            Currency = entity.Currency,
            CloseDate = entity.CloseDate,
            Source = entity.Source,
            AccountId = entity.AccountId,
            AccountName = entity.Account?.AccountName,
            ContactId = entity.ContactId,
            ContactName = entity.Contact != null
                                ? entity.Contact.DisplayName
                                : null,
            Products = entity.OpportunityProducts.Select(p => p.ToModal()).ToList(),
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            IsActive = entity.IsActive
        };
    }

    public static OpportunityProductItem ToModal(this OpportunityProduct entity)
    {
        return new OpportunityProductItem
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            ProductName = entity.Product?.Name,
            //Quantity = entity.Quantity,
            //UnitPrice = entity.UnitPrice,
            //DiscountPercent = entity.DiscountPercent,
            //DiscountAmount = entity.DiscountAmount,
            //Description = entity.Description,
            //TotalPrice = entity.TotalPrice
        };
    }

    // ========================
    // Modal → Entity
    // ========================

    public static void UpdateFrom(this Opportunity entity, OpportunityDetailItem modal)
    {
        entity.Name = modal.Name;
        entity.Description = modal.Description;
        entity.Stage = modal.Stage;
        entity.Probability = modal.Probability;
        entity.EstimatedValue = modal.EstimatedValue;
        entity.ActualValue = modal.ActualValue;
        entity.Currency = modal.Currency;
        entity.CloseDate = modal.CloseDate;
        entity.Source = modal.Source;
        entity.AccountId = modal.AccountId;
        entity.ContactId = modal.ContactId;

        SyncProducts(entity, modal);
    }

    // ========================
    // Sync (Sub-Entities)
    // ========================

    private static void SyncProducts(Opportunity entity, OpportunityDetailItem modal)
    {
        // Modalda olmayan kalemleri sil
        var toRemove = entity.OpportunityProducts
            .Where(p => !modal.Products.Any(m => m.Id == p.Id))
            .ToList();

        foreach (var product in toRemove)
            entity.OpportunityProducts.Remove(product);

        foreach (var modalProduct in modal.Products)
        {
            var existing = modalProduct.Id != Guid.Empty
                ? entity.OpportunityProducts.FirstOrDefault(p => p.Id == modalProduct.Id)
                : null;

            if (existing == null)
            {
                entity.OpportunityProducts.Add(modalProduct.ToEntity(entity.Id));
            }
            else
            {
                existing.UpdateFrom(modalProduct);
            }
        }
    }

    // ========================
    // UpdateFrom (Sub-Entities)
    // ========================

    private static void UpdateFrom(this OpportunityProduct entity, OpportunityProductItem modal)
    {
        entity.ProductId = modal.ProductId;
        //entity.Quantity = modal.Quantity;
        //entity.UnitPrice = modal.UnitPrice;
        //entity.DiscountPercent = modal.DiscountPercent;
        //entity.DiscountAmount = modal.DiscountAmount;
        //entity.Description = modal.Description;
        //entity.TotalPrice = CalculateTotalPrice(modal);
    }

    // ========================
    // ToEntity (Sub-Entities)
    // ========================

    private static OpportunityProduct ToEntity(this OpportunityProductItem modal, Guid opportunityId)
    {
        return new OpportunityProduct
        {
            OpportunityId = opportunityId,
            ProductId = modal.ProductId,
            //Quantity = modal.Quantity,
            //UnitPrice = modal.UnitPrice,
            //DiscountPercent = modal.DiscountPercent,
            //DiscountAmount = modal.DiscountAmount,
            //Description = modal.Description,
            //TotalPrice = CalculateTotalPrice(modal)
        };
    }

    // ========================
    // Helpers
    // ========================

    /// <summary>
    /// (Quantity * UnitPrice) - DiscountAmount - (Quantity * UnitPrice * DiscountPercent / 100)
    /// </summary>
    //private static decimal CalculateTotalPrice(OpportunityProductItem modal)
    //{
    //    var gross = modal.Quantity * modal.UnitPrice;
    //    var discount = modal.DiscountAmount + (gross * modal.DiscountPercent / 100m);
    //    return Math.Max(0, gross - discount);
    //}
}