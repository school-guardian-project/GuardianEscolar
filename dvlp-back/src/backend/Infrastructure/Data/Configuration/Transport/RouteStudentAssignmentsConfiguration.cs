using backend.Domain.Entities.Transport;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Transport
{
    public class RouteStudentAssignmentsConfiguration : IEntityTypeConfiguration<RouteStudentAssignments>
    {
        public void Configure(EntityTypeBuilder<RouteStudentAssignments> builder)
        {
            builder.HasKey(rsa => new { rsa.profileId, rsa.routeId });
            builder.HasOne(rsa => rsa.profile).WithMany(p => p.studentAssignments).HasForeignKey(rsa => rsa.profileId);
            builder.HasOne(rsa => rsa.route).WithMany(r => r.studentAssignments).HasForeignKey(rsa => rsa.routeId);
        }
    }
}