using backend.Modules.SchoolManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.SchoolManagement.Infrastructure.Configurations
{
    public class CourseConfiguration : IEntityTypeConfiguration<Course>
    {
        public void Configure(EntityTypeBuilder<Course> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.name).HasMaxLength(255);
            builder.HasOne(c => c.campuse).WithMany().HasForeignKey("campuseId");
        }
    }
}