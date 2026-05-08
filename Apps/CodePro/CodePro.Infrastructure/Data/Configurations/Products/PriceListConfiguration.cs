using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class PriceListConfiguration : IEntityTypeConfiguration<PriceList>
{
    public void Configure(EntityTypeBuilder<PriceList> builder)
    {
        builder.ToTable("price_list");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");
        builder.Property(p => p.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);

        builder.Property(p => p.Code).HasColumnName("code").IsRequired().HasMaxLength(25);
        builder.Property(p => p.Name).HasColumnName("name").IsRequired().HasMaxLength(100);
        builder.Property(p => p.Description).HasColumnName("description").HasColumnType("text");

        builder.Property(p => p.SupplierId).HasColumnName("supplier_id").IsRequired();

        builder.Property(p => p.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");
        builder.Property(p => p.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(p => p.DeletedBy).HasColumnName("deleted_by");
        builder.Property(p => p.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(p => p.Supplier)
            .WithMany()
            .HasForeignKey(p => p.SupplierId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Prices)
            .WithOne(pr => pr.PriceList!)
            .HasForeignKey(pr => pr.PriceListId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(p => p.Code).IsUnique().HasDatabaseName("uq_price_list_code");
    }
}
