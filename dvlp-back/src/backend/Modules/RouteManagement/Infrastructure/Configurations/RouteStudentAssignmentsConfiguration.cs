using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.RouteManagement.Infrastructure.Configurations
{
    public class RouteStudentAssignmentsConfiguration : BaseEntityConfiguration<RouteStudentAssignments>
    {
        public override void Configure(EntityTypeBuilder<RouteStudentAssignments> builder)
        {
            builder.HasOne(rsa => rsa.profile).WithMany(p => p.studentAssignments).HasForeignKey(rsa => rsa.profileId);
            builder.HasOne(rsa => rsa.route).WithMany(r => r.studentAssignments).HasForeignKey(rsa => rsa.routeId);
        }
    }
}