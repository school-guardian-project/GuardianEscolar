using backend.Model.Entities.Transport;
using backend.Model.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Transport
{
    public class BusConfiguration : IEntityTypeConfiguration<Bus>
    {
        public void Configure(EntityTypeBuilder<Bus> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.brand).HasMaxLength(100);
            builder.Property(b => b.model).HasMaxLength(100);
            builder.Property(b => b.capacity).IsRequired();
            builder.HasOne(b => b.school).WithMany(s => s.buses).HasForeignKey(b => b.schoolId);
            builder.HasOne(b => b.driver).WithMany(p => p.driver).HasForeignKey(b => b.driverId);
        }
    }
}