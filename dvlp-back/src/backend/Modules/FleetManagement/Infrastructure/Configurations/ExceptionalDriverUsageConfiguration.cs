using backend.Modules.FleetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.FleetManagement.Infrastructure.Configurations
{
    public class ExceptionalDriverUsageConfiguration : IEntityTypeConfiguration<ExceptionalDriverUsage>
    {
        public void Configure(EntityTypeBuilder<ExceptionalDriverUsage> builder)
        {
            builder.HasKey(edu => edu.Id);
            builder.Property(edu => edu.startDateTime).IsRequired();
            builder.Property(edu => edu.endDateTime).IsRequired();
            builder.Property(edu => edu.reason).HasMaxLength(500);
            builder.HasOne(edu => edu.bus).WithMany(b => b.exceptionalDriverUsages).HasForeignKey(edu => edu.busId);
            builder.HasOne(edu => edu.profile).WithMany().HasForeignKey(edu => edu.profileId);
        }
    }
}