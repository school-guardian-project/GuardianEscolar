using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.SchoolManagement.Infrastructure.Configurations
{
    public class CourseConfiguration : BaseEntityConfiguration<Course>
    {
        public override void Configure(EntityTypeBuilder<Course> builder)
        {
            builder.Property(c => c.name).HasMaxLength(50);
            builder.HasOne(c => c.campuse).WithMany().HasForeignKey(c => c.campuseId);
        }
    }
}