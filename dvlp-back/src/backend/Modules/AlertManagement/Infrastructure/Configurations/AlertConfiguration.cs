using backend.Modules.AlertManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.AlertManagement.Infrastructure.Configurations
{
    public class AlertConfiguration : IEntityTypeConfiguration<Alert>
    {
        public void Configure(EntityTypeBuilder<Alert> builder)
        {
            builder.Property(a => a.dateTime).IsRequired();
            builder.HasOne(a => a.alertType).WithMany(at => at.alerts).HasForeignKey(a => a.alertTypeId);
            builder.HasOne(a => a.bus).WithMany(b => b.alerts).HasForeignKey(a => a.busId);
        }
    }
}