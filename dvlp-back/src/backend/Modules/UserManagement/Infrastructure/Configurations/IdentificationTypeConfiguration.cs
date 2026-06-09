using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.UserManagement.Infrastructure.Configurations
{
    public class IdentificationTypeConfiguration : BaseEntityConfiguration<IdentificationType>
    {
        public override void Configure(EntityTypeBuilder<IdentificationType> builder)
        {
            builder.Property(i => i.name).HasMaxLength(30);
        }
    }
}