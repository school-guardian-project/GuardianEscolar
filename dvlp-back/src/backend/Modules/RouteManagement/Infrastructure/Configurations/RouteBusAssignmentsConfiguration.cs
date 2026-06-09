using backend.Modules.RouteManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.RouteManagement.Infrastructure.Configurations
{
    public class RouteBusAssignmentsConfiguration : IEntityTypeConfiguration<RouteBusAssignments>
    {
        public void Configure(EntityTypeBuilder<RouteBusAssignments> builder)
        {
            builder.HasOne(rba => rba.bus).WithMany(b => b.busAssignments).HasForeignKey(rba => rba.busId);
            builder.HasOne(rba => rba.route).WithMany(r => r.busAssignments).HasForeignKey(rba => rba.routeId);
        }
    }
}