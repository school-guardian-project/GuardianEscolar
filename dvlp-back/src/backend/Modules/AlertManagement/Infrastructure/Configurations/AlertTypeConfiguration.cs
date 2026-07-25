using backend.Modules.AlertManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.AlertManagement.Infrastructure.Configurations
{
    public class AlertTypeConfiguration : BaseEntityConfiguration<AlertType>
    {
        public override void Configure(EntityTypeBuilder<AlertType> builder)
        {
            base.Configure(builder);
            builder.Property(at => at.name).HasMaxLength(30);
            builder.Property(at => at.description).HasMaxLength(100);
            builder.Property(at => at.urgencyLevel);
        }
    }
}