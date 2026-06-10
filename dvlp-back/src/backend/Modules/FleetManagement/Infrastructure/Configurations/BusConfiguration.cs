using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.FleetManagement.Infrastructure.Configurations
{
    public class BusConfiguration : BaseEntityConfiguration<Bus>
    {
        public override void Configure(EntityTypeBuilder<Bus> builder)
        {
            builder.HasOne(b => b.lineModel).WithMany(lm => lm.bus).HasForeignKey(b => b.lineModelId);
            builder.HasOne(b => b.school).WithMany(s => s.buses).HasForeignKey(b => b.schoolId);
            builder.HasOne(b => b.driver).WithMany(p => p.driver).HasForeignKey(b => b.driverId);
        }
    }
}