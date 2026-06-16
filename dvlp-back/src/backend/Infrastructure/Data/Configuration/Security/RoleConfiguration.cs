using backend.Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Security
{
    public class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.HasKey(r => r.id);
            builder.Property(r => r.name).HasMaxLength(255);
            builder.Property(r => r.description).HasMaxLength(500);
            builder.Property(r => r.permissions).HasMaxLength(2000);
        }
    }
}