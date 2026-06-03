using backend.Modules.Security.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
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