using backend.Domain.Entities.Transport;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Transport
{
    public class RouteBusAssignmentsConfiguration : IEntityTypeConfiguration<RouteBusAssignments>
    {
        public void Configure(EntityTypeBuilder<RouteBusAssignments> builder)
        {
            builder.HasKey(rba => new { rba.busId, rba.routeId });
            builder.HasOne(rba => rba.bus).WithMany(b => b.busAssignments).HasForeignKey(rba => rba.busId);
            builder.HasOne(rba => rba.route).WithMany(r => r.busAssignments).HasForeignKey(rba => rba.routeId);
        }
    }
}