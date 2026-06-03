using backend.Modules.Security.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ViewConfiguration : IEntityTypeConfiguration<View>
    {
        public void Configure(EntityTypeBuilder<View> builder)
        {
            builder.HasKey(v => v.viewId);
            builder.Property(v => v.name).HasMaxLength(255);
            builder.Property(v => v.description).HasMaxLength(1000);
        }
    }
}