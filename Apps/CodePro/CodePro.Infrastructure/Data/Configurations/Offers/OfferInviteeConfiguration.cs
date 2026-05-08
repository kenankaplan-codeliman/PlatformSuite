using CodePro.Domain.Entities.Offers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Offers;

public class OfferInviteeConfiguration : IEntityTypeConfiguration<OfferInvitee>
{
    public void Configure(EntityTypeBuilder<OfferInvitee> builder)
    {
        builder.ToTable("offer_invitee");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.OfferId).HasColumnName("offer_id").IsRequired();
        builder.Property(e => e.SupplierId).HasColumnName("supplier_id");
        builder.Property(e => e.SupplierName).HasColumnName("supplier_name").HasMaxLength(300).IsRequired();
        builder.Property(e => e.SupplierEmail).HasColumnName("supplier_email").HasMaxLength(300);
        builder.Property(e => e.InvitedAt).HasColumnName("invited_at");
        builder.Property(e => e.Status).HasColumnName("status").HasMaxLength(30).IsRequired();

        builder.Property(e => e.QuoteAmount).HasColumnName("quote_amount").HasColumnType("numeric(18,2)");
        builder.Property(e => e.QuoteCurrency).HasColumnName("quote_currency").HasMaxLength(10);
        builder.Property(e => e.QuoteNotes).HasColumnName("quote_notes").HasColumnType("text");
        builder.Property(e => e.QuotedAt).HasColumnName("quoted_at");

        builder.HasIndex(e => e.OfferId).HasDatabaseName("ix_offer_invitee_offer_id");
    }
}
