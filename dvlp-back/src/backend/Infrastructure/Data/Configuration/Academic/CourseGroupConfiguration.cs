using backend.Domain.Entities.Academic;
using backend.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Academic
{
    public class CourseGroupConfiguration : IEntityTypeConfiguration<CourseGroup>
    {
        public void Configure(EntityTypeBuilder<CourseGroup> builder)
        {
            builder.HasKey(cg => new { cg.profileId, cg.courseId });
            builder.HasOne(cg => cg.course).WithMany(c => c.courses).HasForeignKey(cg => cg.courseId);
            builder.HasOne(cg => cg.profile).WithMany(c => c.courseGroups).HasForeignKey(cg => cg.profileId);
        }
    }
}