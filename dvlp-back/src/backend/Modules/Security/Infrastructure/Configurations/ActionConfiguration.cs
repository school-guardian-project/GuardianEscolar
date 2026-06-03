using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ActionEntity = backend.Modules.Security.Domain.Entities.Action;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ActionConfiguration : IEntityTypeConfiguration<ActionEntity>
    {
        public void Configure(EntityTypeBuilder<ActionEntity> builder)
        {
            builder.HasKey(a => a.actionId);
            builder.Property(a => a.name).HasMaxLength(255);
            builder.Property(a => a.description).HasMaxLength(500);
        }
    }
}