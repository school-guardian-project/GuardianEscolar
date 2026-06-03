using backend.Modules.AlertManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.AlertManagement.Infrastructure.Configurations
{
    public class AlertTypeConfiguration : IEntityTypeConfiguration<AlertType>
    {
        public void Configure(EntityTypeBuilder<AlertType> builder)
        {
            builder.HasKey(at => at.alertTypeId);
            builder.Property(at => at.name).HasMaxLength(255);
            builder.Property(at => at.description).HasMaxLength(500);
            builder.Property(at => at.urgencyLevel);
        }
    }
}