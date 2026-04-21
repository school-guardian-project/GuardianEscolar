using backend.Domain.Entities.Transport;
using backend.Domain.Entities.School;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Transport
{
    public class StopConfiguration : IEntityTypeConfiguration<Stop>
    {
        public void Configure(EntityTypeBuilder<Stop> builder)
        {
            builder.HasKey(s => s.Id);
            builder.Property(s => s.address).HasMaxLength(500).IsRequired();
            builder.Property(s => s.longitude).HasPrecision(18, 10);
            builder.Property(s => s.latitude).HasPrecision(18, 10);
            builder.HasOne(s => s.school).WithMany(s => s.stops).HasForeignKey(s => s.schoolId);
            builder.HasOne(s => s.city).WithMany(c => c.stops).HasForeignKey(s => s.cityId);
        }
    }
}