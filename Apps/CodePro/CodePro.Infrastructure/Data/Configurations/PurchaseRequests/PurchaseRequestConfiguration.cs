using CodePro.Domain.Entities.PurchaseRequests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.PurchaseRequests;

public class PurchaseRequestConfiguration : IEntityTypeConfiguration<PurchaseRequest>
{
    public void Configure(EntityTypeBuilder<PurchaseRequest> builder)
    {
        builder.ToTable("purchase_request");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasColumnName("id");
        builder.Property(r => r.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);
        builder.Property(r => r.RequestNumber).HasColumnName("request_number").IsRequired().HasMaxLength(25);
        builder.Property(r => r.Title).HasColumnName("title").IsRequired().HasMaxLength(50);
        builder.Property(r => r.Description).HasColumnName("description").HasColumnType("text");
        builder.Property(r => r.Status).HasColumnName("status").IsRequired().HasConversion<string>().HasMaxLength(20);
        builder.Property(r => r.Priority).HasColumnName("priority").IsRequired().HasConversion<string>().HasMaxLength(10);
        builder.Property(r => r.RequestDate).HasColumnName("request_date").IsRequired();
        builder.Property(r => r.RequiredDate).HasColumnName("required_date");
        builder.Property(r => r.CurrencyCode).HasColumnName("currency_code").HasMaxLength(3);
        builder.Property(r => r.TotalAmount).HasColumnName("total_amount").HasColumnType("numeric(18,2)").IsRequired().HasDefaultValue(0m);
        builder.Property(r => r.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(r => r.OrganizationId).HasColumnName("organization_id").IsRequired();
        builder.Property(r => r.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(r => r.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(r => r.UpdatedBy).HasColumnName("updated_by");
        builder.Property(r => r.UpdatedAt).HasColumnName("updated_at");
        builder.Property(r => r.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(r => r.DeletedBy).HasColumnName("deleted_by");
        builder.Property(r => r.DeletedAt).HasColumnName("deleted_at");

        builder.HasIndex(r => r.RequestNumber).IsUnique().HasDatabaseName("uq_purchase_request_number");

        builder.HasMany(r => r.Lines)
            .WithOne(l => l.PurchaseRequest)
            .HasForeignKey(l => l.PurchaseRequestId)
            .HasConstraintName("fk_purchase_request_line_request")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
