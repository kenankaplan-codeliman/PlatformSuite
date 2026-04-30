using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductKeywordConfiguration : IEntityTypeConfiguration<ProductKeyword>
{
    public void Configure(EntityTypeBuilder<ProductKeyword> builder)
    {
        builder.ToTable("product_keyword");
        builder.HasKey(k => k.Id);
        builder.Property(k => k.Id).HasColumnName("id");
        builder.Property(k => k.ProductId).HasColumnName("product_id").IsRequired();
        builder.Property(k => k.Keyword).HasColumnName("keyword").IsRequired().HasMaxLength(100);

        builder.HasOne(k => k.Product)
            .WithMany(p => p.Keywords)
            .HasForeignKey(k => k.ProductId);
    }
}
