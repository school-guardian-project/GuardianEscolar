using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.SchoolManagement.Infrastructure.Configurations
{
    public class CourseGroupConfiguration : BaseEntityConfiguration<CourseGroup>
    {
        public override void Configure(EntityTypeBuilder<CourseGroup> builder)
        {
            builder.HasOne(cg => cg.course).WithMany(c => c.courses).HasForeignKey(cg => cg.courseId);
            builder.HasOne(cg => cg.profile).WithMany(c => c.courseGroups).HasForeignKey(cg => cg.profileId);
        }
    }
}