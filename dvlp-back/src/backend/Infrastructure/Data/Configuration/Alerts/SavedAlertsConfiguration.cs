using backend.Domain.Entities.Alerts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Alerts
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