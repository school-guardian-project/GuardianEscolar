using backend.Model.Entities.Alerts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Alerts
{
    public class AlertTypeConfiguration : IEntityTypeConfiguration<AlertType>
    {
        public void Configure(EntityTypeBuilder<AlertType> builder)
        {
            builder.HasKey(at => at.Id);
            builder.Property(at => at.name).HasMaxLength(255);
            builder.Property(at => at.description).HasMaxLength(500);
            builder.Property(at => at.urgencyLevel);
        }
    }
}