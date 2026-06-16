using backend.Domain.Entities.Transport;
using backend.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Transport
{
    public class BusConfiguration : IEntityTypeConfiguration<Bus>
    {
        public void Configure(EntityTypeBuilder<Bus> builder)
        {
            builder.HasKey(b => b.Id);
            builder.HasOne(b => b.lineModel).WithMany(lm => lm.bus).HasForeignKey(b => b.lineModelId);
            builder.HasOne(b => b.school).WithMany(s => s.buses).HasForeignKey(b => b.schoolId);
            builder.HasOne(b => b.driver).WithMany(p => p.driver).HasForeignKey(b => b.driverId);
        }
    }
}