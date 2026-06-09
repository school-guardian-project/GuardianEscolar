using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ActionEntity = backend.Modules.Security.Domain.Entities.Action;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ActionConfiguration : BaseEntityConfiguration<ActionEntity>
    {
        public override void Configure(EntityTypeBuilder<ActionEntity> builder)
        {
            builder.Property(a => a.name).HasMaxLength(30);
            builder.Property(a => a.description).HasMaxLength(100);
        }
    }
}