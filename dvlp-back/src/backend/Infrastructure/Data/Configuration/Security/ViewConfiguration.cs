using backend.Model.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Security
{
    public class ViewConfiguration : IEntityTypeConfiguration<View>
    {
        public void Configure(EntityTypeBuilder<View> builder)
        {
            builder.HasKey(v => v.id);
            builder.Property(v => v.name).HasMaxLength(255);
            builder.Property(v => v.description).HasMaxLength(1000);
        }
    }
}