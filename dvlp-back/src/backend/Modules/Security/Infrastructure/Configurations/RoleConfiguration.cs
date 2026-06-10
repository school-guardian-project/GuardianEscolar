using backend.Modules.Security.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class RoleConfiguration : BaseEntityConfiguration<Role>
    {
        public override void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.Property(r => r.name).HasMaxLength(20);
            builder.Property(r => r.description).HasMaxLength(100);
            builder.Property(r => r.permissions).HasMaxLength(40);
        }
    }
}