using backend.Modules.UserManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.UserManagement.Infrastructure.Persistence.Configurations
{
    public class IdentificationTypeConfiguration : IEntityTypeConfiguration<IdentificationType>
    {
        public void Configure(EntityTypeBuilder<IdentificationType> builder)
        {
            builder.HasKey(i => i.identificationId);
            builder.Property(i => i.name).HasMaxLength(100);
        }
    }
}