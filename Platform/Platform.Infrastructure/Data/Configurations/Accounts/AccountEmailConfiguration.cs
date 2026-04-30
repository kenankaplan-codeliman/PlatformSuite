using Platform.Domain.Entities.Accounts;
using Platform.Infrastructure.Data.Configurations.Communications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Accounts;

public class AccountEmailConfiguration : EmailBaseConfiguration<AccountEmail>
{
    public override void Configure(EntityTypeBuilder<AccountEmail> builder)
    {
        base.Configure(builder);

        builder.ToTable("account_email");

        builder.Property(e => e.AccountId)
            .HasColumnName("account_id")
            .IsRequired();
    }
}
