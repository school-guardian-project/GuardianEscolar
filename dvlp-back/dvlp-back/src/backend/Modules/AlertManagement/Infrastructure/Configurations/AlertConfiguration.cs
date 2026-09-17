using backend.Modules.AlertManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.AlertManagement.Infrastructure.Configurations
{
    public class AlertConfiguration : BaseEntityConfiguration<Alert>
    {
        public override void Configure(EntityTypeBuilder<Alert> builder)
        {
            base.Configure(builder);
            builder.Property(a => a.dateTime).IsRequired().HasDefaultValueSql("NOW()");
            builder.HasOne(a => a.alertType).WithMany(at => at.alerts).HasForeignKey(a => a.alertTypeId);
            builder.HasOne(a => a.bus).WithMany(b => b.alerts).HasForeignKey(a => a.busId);
        }
    }
}