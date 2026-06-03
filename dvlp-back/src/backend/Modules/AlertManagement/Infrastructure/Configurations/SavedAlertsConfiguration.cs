using backend.Modules.AlertManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.AlertManagement.Infrastructure.Configurations
{
    public class SavedAlertsConfiguration : IEntityTypeConfiguration<SavedAlert>
    {
        public void Configure(EntityTypeBuilder<SavedAlert> builder)
        {
            builder.HasKey(sa => new { sa.profileId, sa.alertId });
            builder.HasOne(sa => sa.alerts).WithMany(a => a.savedAlerts).HasForeignKey(sa => sa.alertId);
            builder.HasOne(sa => sa.profile).WithMany(p => p.savedAlerts).HasForeignKey(sa => sa.profileId);
        }
    }
}