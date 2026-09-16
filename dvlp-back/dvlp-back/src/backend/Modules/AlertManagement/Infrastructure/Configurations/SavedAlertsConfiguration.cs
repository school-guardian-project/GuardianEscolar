using backend.Modules.AlertManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.AlertManagement.Infrastructure.Configurations
{
    public class SavedAlertsConfiguration : BaseEntityConfiguration<SavedAlert>
    {
        public override void Configure(EntityTypeBuilder<SavedAlert> builder)
        {
            base.Configure(builder);
            builder.HasOne(sa => sa.alerts).WithMany(a => a.savedAlerts).HasForeignKey(sa => sa.alertId);
            builder.HasOne(sa => sa.profile).WithMany(p => p.savedAlerts).HasForeignKey(sa => sa.profileId);
        }
    }
}