using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.FleetManagement.Infrastructure.Configurations
{
    public class ExceptionalDriverUsageConfiguration : BaseEntityConfiguration<ExceptionalDriverUsage>
    {
        public override void Configure(EntityTypeBuilder<ExceptionalDriverUsage> builder)
        {
            builder.Property(edu => edu.startDateTime).HasDefaultValueSql("NOW()");
            builder.Property(edu => edu.endDateTime).HasDefaultValueSql("NOW()");
            builder.Property(edu => edu.reason).HasMaxLength(200);
            builder.HasOne(edu => edu.bus).WithMany(b => b.exceptionalDriverUsages).HasForeignKey(edu => edu.busId);
            builder.HasOne(edu => edu.profile).WithMany(p => p.exceptions).HasForeignKey(edu => edu.profileId);
        }
    }
}