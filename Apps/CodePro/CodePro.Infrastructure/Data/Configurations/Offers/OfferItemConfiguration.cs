using CodePro.Domain.Entities.Offers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Offers;

public class OfferItemConfiguration : IEntityTypeConfiguration<OfferItem>
{
    public void Configure(EntityTypeBuilder<OfferItem> builder)
    {
        builder.ToTable("offer_item");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.OfferId).HasColumnName("offer_id").IsRequired();
        builder.Property(e => e.OrderIndex).HasColumnName("order_index").IsRequired().HasDefaultValue(0);
        builder.Property(e => e.ProductId).HasColumnName("product_id");
        builder.Property(e => e.ProductName).HasColumnName("product_name").HasMaxLength(500).IsRequired();

        builder.Property(e => e.Quantity).HasColumnName("quantity").HasColumnType("numeric(18,4)").IsRequired();

        builder.Property(e => e.Unit)
            .HasColumnName("unit").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.UnitPrice).HasColumnName("unit_price").HasColumnType("numeric(18,4)").IsRequired();

        builder.Property(e => e.VatRate)
            .HasColumnName("vat_rate").HasMaxLength(20).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.LineTotal).HasColumnName("line_total").HasColumnType("numeric(18,2)").IsRequired();
        builder.Property(e => e.LineVat).HasColumnName("line_vat").HasColumnType("numeric(18,2)").IsRequired();

        builder.HasIndex(e => e.OfferId).HasDatabaseName("ix_offer_item_offer_id");
    }
}
