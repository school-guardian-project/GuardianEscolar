using backend.Modules.Security.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ViewConfiguration : BaseEntityConfiguration<View>
    {
        public override void Configure(EntityTypeBuilder<View> builder)
        {
            builder.Property(v => v.name).HasMaxLength(30);
            builder.Property(v => v.description).HasMaxLength(100);
        }
    }
}