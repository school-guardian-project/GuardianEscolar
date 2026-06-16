using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;

namespace backend.Modules.RouteManagement.Infrastructure.Configurations
{
    public class StopConfiguration : BaseEntityConfiguration<Stop>
    {
        public override void Configure(EntityTypeBuilder<Stop> builder)
        {
            builder.Property(s => s.address).HasMaxLength(30).IsRequired();
            builder.Property(s => s.longitude).HasPrecision(12, 2);
            builder.Property(s => s.latitude).HasPrecision(12, 2);
            builder.HasOne(s => s.school).WithMany(s => s.stops).HasForeignKey(s => s.schoolId);
            builder.HasOne(s => s.city).WithMany(c => c.stops).HasForeignKey(s => s.cityId);
        }
    }
}