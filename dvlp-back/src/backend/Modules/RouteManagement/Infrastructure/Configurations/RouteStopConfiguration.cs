using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.RouteManagement.Infrastructure.Configurations
{
    public class RouteStopConfiguration : BaseEntityConfiguration<RouteStop>
    {
        public override void Configure(EntityTypeBuilder<RouteStop> builder)
        {
            builder.HasOne(rs => rs.route).WithMany(r => r.routeStops).HasForeignKey(rs => rs.routeId);
            builder.HasOne(rs => rs.stop).WithMany(r => r.routeStops).HasForeignKey(rs => rs.stopId);
        }
    }
}