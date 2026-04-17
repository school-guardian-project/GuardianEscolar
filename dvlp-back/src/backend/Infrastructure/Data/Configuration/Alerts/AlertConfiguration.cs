using backend.Model.Entities.Alerts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Alerts
{
    public class AlertConfiguration : IEntityTypeConfiguration<Alert>
    {
        public void Configure(EntityTypeBuilder<Alert> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.dateTime).IsRequired();
            builder.HasOne(a => a.alertType).WithMany(at => at.alerts).HasForeignKey(a => a.alertTypeId);
            builder.HasOne(a => a.bus).WithMany(b => b.alerts).HasForeignKey(a => a.busId);
        }
    }
}