using Platform.Domain.Entities.Attachments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Attachments;

public class AttachmentFileDataConfiguration : IEntityTypeConfiguration<AttachmentFileData>
{
    public void Configure(EntityTypeBuilder<AttachmentFileData> builder)
    {
        builder.ToTable("attachment_file_data");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id).HasColumnName("id");
        builder.Property(d => d.DataBytes).HasColumnName("data_bytes").IsRequired().HasColumnType("bytea");
    }
}
