using backend.Domain.Entities.Transport;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Transport
{
    public class RouteStopConfiguration : IEntityTypeConfiguration<RouteStop>
    {
        public void Configure(EntityTypeBuilder<RouteStop> builder)
        {
            builder.HasKey(rs => new { rs.routeId, rs.stopId });
            builder.HasOne(rs => rs.route).WithMany(r => r.routeStops).HasForeignKey(rs => rs.routeId);
            builder.HasOne(rs => rs.stop).WithMany(r => r.routeStops).HasForeignKey(rs => rs.stopId);
        }
    }
}