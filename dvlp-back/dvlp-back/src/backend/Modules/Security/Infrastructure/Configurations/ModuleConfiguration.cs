using backend.Modules.Security.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ModuleConfiguration : BaseEntityConfiguration<Module>
    {
        public override void Configure(EntityTypeBuilder<Module> builder)
        {
            builder.Property(m => m.name).HasMaxLength(30);
            builder.Property(m => m.description).HasMaxLength(100);
        }
    }
}