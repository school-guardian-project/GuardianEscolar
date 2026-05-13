using backend.Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Security
{
    public class ModuleConfiguration : IEntityTypeConfiguration<Module>
    {
        public void Configure(EntityTypeBuilder<Module> builder)
        {
            builder.HasKey(m => m.id);
            builder.Property(m => m.name).HasMaxLength(255);
            builder.Property(m => m.description).HasMaxLength(1000);
        }
    }
}