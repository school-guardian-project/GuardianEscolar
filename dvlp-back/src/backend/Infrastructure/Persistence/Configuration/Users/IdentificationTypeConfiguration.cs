using backend.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Users
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