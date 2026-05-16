using backend.Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ActionEntity = backend.Domain.Entities.Security.Action;

namespace backend.Infrastructure.Persistence.Configuration.Security
{
    public class ActionConfiguration : IEntityTypeConfiguration<ActionEntity>
    {
        public void Configure(EntityTypeBuilder<ActionEntity> builder)
        {
            builder.HasKey(a => a.id);
            builder.Property(a => a.name).HasMaxLength(255);
            builder.Property(a => a.description).HasMaxLength(500);
        }
    }
}